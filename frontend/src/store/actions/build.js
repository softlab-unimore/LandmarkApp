import axios from "axios"
import {config} from "../../Constants"
import * as actionTypes from './actionTypes'


export const uploadStart = () => {
    return {
        type: actionTypes.UPLOAD_START
    }
}

export const datasetUploadSuccess = (dataset) => {
    return {
        type: actionTypes.DATASET_UPLOAD_SUCCESS,
        dataset: dataset,
    }
}

export const datasetRemoveUpload = () => {
    return {
        type: actionTypes.DATASET_REMOVE_UPLOAD,
    }
}

export const wrapperUploadSuccess = (wrapper) => {
    return {
        type: actionTypes.WRAPPER_UPLOAD_SUCCESS,
        wrapper: wrapper,
    }
}

export const wrapperRemoveUpload = () => {
    return {
        type: actionTypes.WRAPPER_REMOVE_UPLOAD,
    }
}

export const modelUploadSuccess = (model) => {
    return {
        type: actionTypes.MODEL_UPLOAD_SUCCESS,
        model: model,
    }
}

export const modelRemoveUpload = () => {
    return {
        type: actionTypes.MODEL_REMOVE_UPLOAD,
    }
}

export const uploadFail = error => {
    return {
        type: actionTypes.UPLOAD_FAIL,
        error: error
    }
}

export const fileUpload = (file, type) => {
    return dispatch => {
        dispatch(uploadStart())

        // if (type === 'model')
        //     dispatch(modelUploadSuccess([file]));
        // else if (type === 'dataset')
        //     dispatch(datasetUploadSuccess([file]));
        // else
        //     dispatch(uploadFail("Type of file not supported"));
        //
        // return


        // Starting to upload the given file
        // Creat the form object
        let formData = new FormData()
        formData.append("file", file)
        axios
            .post(
                'http://' + config.url.API_URL + `/api/load-file`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data',
                    }
                })
            .then(res => {
                // Successful uploaded the file
                if (type === 'model')
                    dispatch(modelUploadSuccess([file]))
                else if (type === 'wrapper')
                    dispatch(wrapperUploadSuccess([file]))
                else if (type === 'dataset')
                    dispatch(datasetUploadSuccess([file]))
                else
                    dispatch(uploadFail("Type of file not supported"))
            })
            .catch(err => {
                // Error during uploading file
                dispatch(uploadFail("Impossible to upload the selected file"))
            })
    }
}

export const paramsSetLeftPrefix = leftPrefix => {
    return {
        type: actionTypes.PARAMS_SET_LEFT_PREFIX,
        leftPrefix: leftPrefix
    }
}

export const paramsSetRightPrefix = rightPrefix => {
    return {
        type: actionTypes.PARAMS_SET_RIGHT_PREFIX,
        rightPrefix: rightPrefix
    }
}

export const paramsSetLabel = label => {
    return {
        type: actionTypes.PARAMS_SET_LABEL,
        label: label
    }
}

export const recordStart = () => {
    return {
        type: actionTypes.RECORD_START
    }
}

export const recordFail = error => {
    return {
        type: actionTypes.RECORD_FAIL,
        error: error
    }
}

export const recordReadSuccess = (recordList) => {
    return {
        type: actionTypes.RECORD_READ_SUCCESS,
        recordList: recordList,
    }
}

export const recordRead = (name) => {
    return dispatch => {
        dispatch(recordStart());
        // dispatch(recordReadSuccess(myData));
        // return

        // Read records from the selected dataset
        let data = {dataset_name: name};
        axios
            .post(
                'http://' + config.url.API_URL + `/api/get-elements`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            .then(res => {
                // Successful read records from the dataset
                let recordList = res.data
                dispatch(recordReadSuccess(recordList))

            })
            .catch(err => {
                // Error during uploading file
                dispatch(recordFail("Impossible read records from the uploaded dataset"))
            })
    }
}

export const recordSelectRecords = recordSelectedList => {
    return {
        type: actionTypes.RECORD_SELECT_RECORDS,
        recordSelectedList: recordSelectedList
    }
}

export const explanationStart = () => {
    return {
        type: actionTypes.EXPLANATION_START
    }
}

export const explanationFail = error => {
    return {
        type: actionTypes.EXPLANATION_FAIL,
        error: error
    }
}

export const explanationReadSuccess = (explanationList) => {
    return {
        type: actionTypes.EXPLANATION_READ_SUCCESS,
        explanationList: explanationList,
    }
}

export const explanationRead = (dataset, model, wrapper, idxList, leftPref, rightPref, label) => {
    return dispatch => {
        dispatch(explanationStart());
        // dispatch(explanationReadSuccess(myData2));
        // return

        let data = {
            dataset_name: dataset,
            model_state: model,
            index_list: idxList,
            left: leftPref,
            right: rightPref,
            label: label,

        }
        axios
            .post(
                'http://' + config.url.API_URL + `/api/explain`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            .then(res => {
                let explanationList = res.data
                dispatch(explanationReadSuccess(explanationList))

            })
            .catch(err => {
                dispatch(explanationFail("Impossible compute explanation for the selected records"))
            })
    }
}

export const adversarialStart = () => {
    return {
        type: actionTypes.ADVERSARIAL_START
    }
}

export const adversarialFail = error => {
    return {
        type: actionTypes.ADVERSARIAL_FAIL,
        error: error
    }
}

export const adversarialReadSuccess = (adversarialList) => {
    return {
        type: actionTypes.ADVERSARIAL_READ_SUCCESS,
        adversarialList: adversarialList,
    }
}

export const adversarialRead = (dataset, model, wrapper, idxList, leftPref, rightPref, label) => {
    return dispatch => {

        dispatch(adversarialStart())
        // dispatch(adversarialReadSuccess(myData3))
        // return

        let data = {
            dataset_name: dataset,
            model_state: model,
            index_list: idxList,
            left: leftPref,
            right: rightPref,
            label: label
        }
        axios
            .post(
                'http://' + config.url.API_URL + `/api/adversarial`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            .then(res => {
                let adversarialList = res.data
                dispatch(adversarialReadSuccess(adversarialList))

            })
            .catch(err => {
                dispatch(adversarialFail("Impossible compute adversarial use cases for the selected records"))
            })
    }
}


