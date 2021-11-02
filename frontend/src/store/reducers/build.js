import * as actionTypes from '../actions/actionTypes'
import {updateObject} from '../utility'

const initialState = {
    uploadError: null,
    uploadLoading: false,

    dataset: [],
    leftPrefix: 'left_',
    rightPrefix: 'right_',
    label: 'label',
    model: [],
    wrapper: [],

    recordError: null,
    recordLoading: null,
    recordList: [],
    recordSelectedList: [],

    explanationList: [],
    explanationError: null,
    explanationLoading: null,

    adversarialList: [],
    adversarialError: null,
    adversarialLoading: null,
}

const uploadStart = (state) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: true
    })
}

const uploadFail = (state, action) => {
    return updateObject(state, {
        uploadError: action.error,
        uploadLoading: false,
    })
}

const datasetUploadSuccess = (state, action) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        dataset: action.dataset,
    })
}

const datasetRemoveUpload = (state) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        dataset: [],
    })
}

const modelUploadSuccess = (state, action) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        model: action.model,
    })
}

const modelRemoveUpload = (state) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        model: [],
    })
}

const wrapperUploadSuccess = (state, action) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        wrapper: action.wrapper,
    })
}

const wrapperRemoveUpload = (state) => {
    return updateObject(state, {
        uploadError: null,
        uploadLoading: false,
        wrapper: [],
    })
}

const paramsSetLeftPrefix = (state, action) => {
    return updateObject(state, {
        leftPrefix: action.leftPrefix,
    })
}

const paramsSetRightPrefix = (state, action) => {
    return updateObject(state, {
        rightPrefix: action.rightPrefix,
    })
}

const paramsSetLabel = (state, action) => {
    return updateObject(state, {
        label: action.label,
    })
}

const recordStart = (state) => {
    return updateObject(state, {
        recordError: null,
        recordLoading: true,
        recordList: [],
        recordSelectedList: [],
    })
}

const recordFail = (state, action) => {
    return updateObject(state, {
        recordError: action.error,
        recordLoading: false,
        recordList: [],
        recordSelectedList: [],
    })
}

const recordReadSuccess = (state, action) => {
    return updateObject(state, {
        recordError: null,
        recordLoading: false,

        recordList: action.recordList,
        recordSelectedList: [],
    })
}

const recordSelectRecords = (state, action) => {
    return updateObject(state, {
        recordSelectedList: action.recordSelectedList,
    })
}

const explanationStart = (state) => {
    return updateObject(state, {
        explanationError: null,
        explanationLoading: true,
        explanationList: [],
    })
}

const explanationFail = (state, action) => {
    return updateObject(state, {
        explanationError: action.error,
        explanationLoading: false,
        explanationList: [],
    })
}

const explanationReadSuccess = (state, action) => {
    return updateObject(state, {
        explanationError: null,
        explanationLoading: false,
        explanationList: action.explanationList,
    })
}

const adversarialStart = (state) => {
    return updateObject(state, {
        adversarialError: null,
        adversarialLoading: true,
        adversarialList: [],
    })
}

const adversarialFail = (state, action) => {
    return updateObject(state, {
        adversarialError: action.error,
        adversarialLoading: false,
        adversarialList: [],
    })
}

const adversarialReadSuccess = (state, action) => {
    return updateObject(state, {
        adversarialError: null,
        adversarialLoading: false,
        adversarialList: action.adversarialList,
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPLOAD_START:
            return uploadStart(state, action)
        case actionTypes.UPLOAD_FAIL:
            return uploadFail(state, action)

        case actionTypes.DATASET_UPLOAD_SUCCESS:
            return datasetUploadSuccess(state, action)
        case actionTypes.DATASET_REMOVE_UPLOAD:
            return datasetRemoveUpload(state, action)
        case actionTypes.MODEL_UPLOAD_SUCCESS:
            return modelUploadSuccess(state, action)
        case actionTypes.MODEL_REMOVE_UPLOAD:
            return modelRemoveUpload(state, action)
        case actionTypes.WRAPPER_UPLOAD_SUCCESS:
            return wrapperUploadSuccess(state, action)
        case actionTypes.WRAPPER_REMOVE_UPLOAD:
            return wrapperRemoveUpload(state, action)


        case actionTypes.PARAMS_SET_LEFT_PREFIX:
            return paramsSetLeftPrefix(state, action)
        case actionTypes.PARAMS_SET_RIGHT_PREFIX:
            return paramsSetRightPrefix(state, action)
        case actionTypes.PARAMS_SET_LABEL:
            return paramsSetLabel(state, action)

        case actionTypes.RECORD_START:
            return recordStart(state, action)
        case actionTypes.RECORD_FAIL:
            return recordFail(state, action)
        case actionTypes.RECORD_READ_SUCCESS:
            return recordReadSuccess(state, action)
        case actionTypes.RECORD_SELECT_RECORDS:
            return recordSelectRecords(state, action)

        case actionTypes.EXPLANATION_START:
            return explanationStart(state, action)
        case actionTypes.EXPLANATION_FAIL:
            return explanationFail(state, action)
        case actionTypes.EXPLANATION_READ_SUCCESS:
            return explanationReadSuccess(state, action)

        case actionTypes.ADVERSARIAL_START:
            return adversarialStart(state, action)
        case actionTypes.ADVERSARIAL_FAIL:
            return adversarialFail(state, action)
        case actionTypes.ADVERSARIAL_READ_SUCCESS:
            return adversarialReadSuccess(state, action)

        default:
            return state
    }
}

export default reducer


