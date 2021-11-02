import * as actionTypes from "../actions/actionTypes"  
import { updateObject } from "../utility"  

const initialState = {
    item: 'explanation',
}  

const selectItem = (state, action) => {
    return updateObject(state,
        { item: action.item })  
}  

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECT_ITEM:
            return selectItem(state, action)  
        default:
            return state  
    }
}  

export default reducer  
