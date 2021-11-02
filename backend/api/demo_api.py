from scipy.stats import entropy
import ast
import os
import pickle

import numpy as np
import pandas as pd

from Landmark_backend.settings import BASE_DIR

from landmark.landmark.landmark import Mapper, Landmark

exclude_attrs = ['left_id', 'right_id', 'id', ' prediction', 'label']

def compute_metrics(impacts):
    res_dict = {}
    res_dict.update(max=max(impacts),
                    min=min(impacts),
                    average=np.mean(impacts),
                    entropy=round(entropy(np.abs(impacts)),4),
                    )
    return res_dict

def get_entropy(left_impacts, right_impacts, kind='normal'):
    res_list = []
    for impacts in [left_impacts, right_impacts]:
        pos_impacts = impacts[impacts > 0]
        neg_impacts = np.abs(impacts[impacts < 0])
        pos_impacts_entropy = compute_entropy(pos_impacts, kind=kind)
        neg_impacts_entropy = compute_entropy(neg_impacts, kind=kind)
        impacts_entropies = np.array([pos_impacts_entropy, neg_impacts_entropy])
        res_list.append(np.min(impacts_entropies[impacts_entropies > 0]))
    return np.min(res_list)


def compute_entropy(counts, kind='normal'):
    """
    This function computes the (normalized) Shannon's entropy.
    """

    # The scipy.stats.entropy routine will normalize the counts if they don’t sum to 1.
    entr = entropy(counts, base=2)

    if kind == 'normalized':
        if entr > 0:
            num_counts = len(counts)
            entr = entr / (num_counts * np.log2(num_counts))
    return entr


def explanation_to_df(word_impacts, el, exclude_attrs=('id', 'left_id', 'right_id', 'pred', 'label')):
    impacts_list = []
    cols = np.setdiff1d(el.columns, exclude_attrs)
    mapper = Mapper(cols, split_expression=' ')
    dict_impact = {}
    for word, impact in word_impacts.values:
        dict_impact.update(column=mapper.attr_map[word[0]], position=int(word[1:3]), word=word[4:], word_prefix=word,
                           impact=impact)
        impacts_list.append(dict_impact.copy())
    res_df = pd.DataFrame(impacts_list)
    res_df['pred'] = el.pred.values[0]
    res_df['id'] = el.id.values[0]
    res_df['label'] = el.label.values[0]
    return res_df


def get_adversarial_words(el, model, exclude_attrs=('id', 'left_id', 'right_id', 'pred', 'label')):
    impacts = single_perturbation_impacts(el, model, exclude_attrs)
    impacts_df = explanation_to_df(impacts, el, exclude_attrs)
    change_class_mask = (impacts_df['pred'] > .5) != ((impacts_df['pred'] - impacts_df['impact']) > .5)
    return impacts_df[change_class_mask]


def explanation_conversion(explanation_df, item, explainer):
    view = explanation_df[['column', 'position', 'word', 'impact']].reset_index(drop=True)
    tokens_divided = explainer.compute_tokens(item)
    exchanged_idx = [False] * len(view)
    lengths = {col: len(words) for col, words in tokens_divided['tokens'].items()}
    for col, words in tokens_divided['tokens_not_overlapped'].items():  # words injected in the opposite side
        prefix, col_name = col.split('_',1)
        prefix = 'left_' if prefix == 'right' else 'right_'
        opposite_col = prefix + col_name
        exchanged_idx = exchanged_idx | ((view.position >= lengths[opposite_col]) & (view.column == opposite_col))
    exchanged = view[exchanged_idx]
    view = view[~exchanged_idx]
    # determine injected impacts
    exchanged['side'] = exchanged['column'].apply(lambda x: x.split('_')[0])
    col_names = exchanged['column'].apply(lambda x: x.split('_')[1])
    exchanged['column'] = np.where(exchanged['side'] == 'left', 'right_', 'left_') + col_names
    tmp = view.merge(exchanged, on=['word', 'column'], how='left', suffixes=('', '_injected'))
    tmp = tmp.drop_duplicates(['column', 'word', 'position'], keep='first')
    impacts_injected = tmp['impact_injected']
    impacts_injected = impacts_injected.fillna(0)

    view['score_right_landmark'] = np.where(view['column'].str.startswith('left'), view['impact'], impacts_injected)
    view['score_left_landmark'] = np.where(view['column'].str.startswith('right'), view['impact'], impacts_injected)
    view.drop('impact', 1, inplace=True)

    return view


# convert landmark to json
def explanation_bundle_to_json(item, explanation_df, explainer,
                               exclude_attrs=('id', 'left_id', 'right_id', 'label', 'pred')):
    res_dict = {}
    item_to_display = item.drop(['id', 'left_id', 'right_id'], 1).rename(columns={'pred': 'prediction'}).round(4)
    cols = item_to_display.columns
    item_dict = ast.literal_eval(item_to_display.to_json(orient='records'))[0]
    res_dict.update(
        record_left=' | '.join(item[[col for col in cols if col.startswith('left_')]].astype(str).values[0]),
        record_right=' | '.join(item[[col for col in cols if col.startswith('right_')]].astype(str).values[0]),
        record=item_dict)
    res_dict.update(label=int(item['label'].values[0]))  # , prediction=round(item['pred'].values[0],4))
    tmp_explanation = explanation_conversion(explanation_df, item, explainer)

    # sort values
    exclude_attrs = np.intersect1d(exclude_attrs, item.columns)
    sorting_index = item.drop(exclude_attrs, 1).columns
    tmp_explanation = tmp_explanation.sort_values(by='position')
    tmp_explanation = tmp_explanation.sort_values(by=['column', 'position'], key=lambda col: col.map(
        dict(zip(sorting_index, range(len(sorting_index))))))
    res_dict['explanation'] = ast.literal_eval(tmp_explanation.round(4).to_json(orient='records'))
    res_dict['metrics'] = compute_metrics(
        pd.concat([tmp_explanation.score_right_landmark, tmp_explanation.score_left_landmark]))
    res_dict['metrics']['entropy'] = get_entropy(tmp_explanation.score_right_landmark, tmp_explanation.score_left_landmark)
    return res_dict


def single_perturbation_impacts(el, model, exclude_attrs=('id', 'left_id', 'right_id', 'pred', 'label')):
    # Generation of the original element
    cols = np.setdiff1d(el.columns, exclude_attrs)
    mapper = Mapper(cols, split_expression=' ')
    start_el = el.copy()[cols]
    start_pred = model.predict(start_el)[0]

    # columns_num_words = { col: len(start_el[col].str.split(' ').values[0]) for col in impacts_df.column.unique()}
    start_encoded = mapper.encode_attr(start_el)
    el_list = []
    tokens = start_encoded.split(' ')
    for token in tokens:
        tmp_encoded = start_encoded.replace(str(token), '').replace('  ', ' ')
        el_list.append(mapper.decode_words_to_attr(tmp_encoded))
    impacts_drop = model.predict(pd.concat(el_list))

    return pd.DataFrame({'word_prefix': tokens, 'impact': start_pred - pd.Series(impacts_drop)})


def api_adversarial_words(item, impacts_df, exclude_attrs=('id', 'left_id', 'right_id', 'label', 'pred')):
    pred = round(float(item.pred.values[0]), 4)
    res_df = dict(content='', label=int(item.label.values[0]), prediction=pred, id=int(item.id.values[0]), add=[])
    cols = np.setdiff1d(item.columns, exclude_attrs)

    record_left = ' | '.join(item[[col for col in cols if col.startswith('left_')]].astype(str).values[0])
    record_right = ' | '.join(item[[col for col in cols if col.startswith('right_')]].astype(str).values[0])
    res_df['content'] = record_left + ' || ' + record_right
    offset_map = {}
    offset = 0
    for col in cols:
        offset_map[col] = offset
        offset += len(item[col].astype(str).values[0].split(' ')) + 1
    add_values = []
    for i in range(impacts_df.shape[0]):
        pos = impacts_df.position.values[i]
        col = impacts_df.column.values[i]
        add_values.append(
            dict(position=int(pos + offset_map[col]), type=-1, prediction=round(pred - impacts_df.impact.values[i], 4)))
    res_df.update(add=add_values)
    return res_df

def get_adversarial(state_path, dataset_path, ids):
    from files.ModelWrapper import ModelWrapper
    selected_items = pd.read_csv(dataset_path).iloc[ids, :]
    model_wrapper = ModelWrapper(state_path, exclude_attrs)
    if 'prediction' not in selected_items.columns:
        selected_items['prediction'] = model_wrapper.predict(selected_items)
    adversarial_res = []
    tmp_df = selected_items.rename(columns={'prediction': 'pred'})
    for i in selected_items['id']:
        el = tmp_df.loc[[i]]
        adv_impacts = get_adversarial_words(el, model_wrapper, exclude_attrs=exclude_attrs)
        adversarial_res.append(api_adversarial_words(el, adv_impacts))
    return adversarial_res


def explain_elements(state_path, dataset_path, ids):
    from files.ModelWrapper import ModelWrapper
    model_wrapper = ModelWrapper(state_path, exclude_attrs)
    dataset_name = os.path.split(dataset_path)[1]


    df = pd.read_csv(dataset_path)
    if 'prediction' not in df.columns:
        df['prediction'] = model_wrapper.predict(df)
        df.set_index('id').to_csv(dataset_path)

    selected_items = df.iloc[ids, :]
    # selected_items['pred'] = selected_items['prediction']
    explainer = Landmark(model_wrapper.predict, selected_items, exclude_attrs=exclude_attrs, lprefix='left_',
                         rprefix='right_', split_expression=r' ')
    conf = ['single', 'double']
    file_path = os.path.join(BASE_DIR, 'files', dataset_name + '_explanation_dict.pickle')

    try:
        with open(file_path, 'rb') as file:
            tmp = pickle.load(file)
        print('Loaded')
        explanations = tmp
    except Exception as e:
        print(e)
        explanations = {'single': {}, 'double': {}}
    res_exp = []
    for i in selected_items['id']:
        el = selected_items.loc[[i]]
        # for curr_conf in conf:
        curr_conf = 'single' if el['prediction'].values[0] > .5 else 'double'
        if i not in explanations[curr_conf].keys():
            exp = explainer.explain(el, conf=curr_conf, num_samples=500)
            explanations[curr_conf][i] = exp
        exp = explanations[curr_conf][i]
        res_exp.append(explanation_bundle_to_json(el, exp, explainer))

    with open(file_path, 'wb') as file:
        pickle.dump(explanations, file)

    return res_exp


def get_df_elements(dataset_path, ids):

    if len(ids)> 0:
        df = pd.read_csv(dataset_path).iloc[ids, :]
    else:
        df = pd.read_csv(dataset_path)
    return ast.literal_eval(df.fillna('').round(4).to_json(orient='records'))
