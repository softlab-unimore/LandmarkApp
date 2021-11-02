import * as actionTypes from "./actionTypes"  

export const setStep = (step) => {
    return {
        type: actionTypes.SET_STEP,
        step: step,
    }  
}  

export const openExplanationPopup = (scenario) => {
    return {
        type: actionTypes.OPEN_EXPLANATION_POPUP,
        scenario: scenario,
    }  
}  

export const closeExplanationPopup = () => {
    return {
        type: actionTypes.CLOSE_EXPLANATION_POPUP
    }  
}  

export const openAdversarialPopup = () => {
    return {
        type: actionTypes.OPEN_ADVERSARIAL_POPUP,
    }  
}  

export const closeAdversarialPopup = () => {
    return {
        type: actionTypes.CLOSE_ADVERSARIAL_POPUP
    }  
}  