import * as actionTypes from "../actions/actionTypes"  
import {updateObject} from "../utility"  

const initialState = {
    currentStep: 0,

    showAdversarialPopup: false,
    showExplanationPopup: false,
    scenario: null,
}  

const setStep = (state, action) => {
    return updateObject(state, {
        currentStep: action.step,
    })  
}  

const openExplanationPopup = (state, action) => {
    return updateObject(state, {
        showExplanationPopup: true,
        scenario: action.scenario,
    })  
}  

const closeExplanationPopup = (state, action) => {

    return updateObject(state, {
        showExplanationPopup: false,
        scenario: null,
    })  
}  

const openAdversarialPopup = (state, action) => {
    return updateObject(state, {
        showAdversarialPopup: true,
    })  
}  

const closeAdversarialPopup = (state, action) => {

    return updateObject(state, {
        showAdversarialPopup: false,
    })  
}  

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.OPEN_EXPLANATION_POPUP:
            return openExplanationPopup(state, action)  
        case actionTypes.CLOSE_EXPLANATION_POPUP:
            return closeExplanationPopup(state, action)  
        case actionTypes.OPEN_ADVERSARIAL_POPUP:
            return openAdversarialPopup(state, action)  
        case actionTypes.CLOSE_ADVERSARIAL_POPUP:
            return closeAdversarialPopup(state, action)  
        case actionTypes.SET_STEP:
            return setStep(state, action)  
        default:
            return state  
    }
}  

export default reducer  