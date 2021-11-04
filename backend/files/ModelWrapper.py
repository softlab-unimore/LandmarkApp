from IPython.utils import io
import os
import deepmatcher as dm

class ModelWrapper:

  def __init__(self, state_path, ignore_columns=[], **kwargs):
    self.ignore_columns = ignore_columns
    self.model = None
    self.params = kwargs
    self.state_dir, self.state_file_name = os.path.split(state_path)
    self.state_path = state_path

  def load_state(self, state_path):
    self.model = dm.MatchingModel(**self.params)
    self.model.load_state(path=state_path)
    self.model.meta.embeddings_cache ='/home/baraldian/content/drive/Shareddrives/SoftLab/Projects/Deepmatcher_embeddings'

  def predict(self, dataset):
    if self.model is None:
      self.load_state(self.state_path)
    self.predictions = []
    file_path = './candidate.csv'
    try:
      dataset.to_csv(file_path, index_label='id')
      with io.capture_output() as captured:
        candidate = dm.data.process_unlabeled(path=file_path, trained_model=self.model,
                                              ignore_columns=self.ignore_columns + ['label'])
        self.predictions = self.model.run_prediction(candidate, batch_size=2048 )
      res = self.predictions['match_score'].values
      os.remove(file_path)
      return res
    except Exception as e:
      os.remove(file_path)
      raise e