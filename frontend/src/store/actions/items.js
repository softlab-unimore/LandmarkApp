import * as actionTypes from "./actionTypes"  

export const selectItem = (item) => {
    return {
        type: actionTypes.SELECT_ITEM,
        item: item
    }  
}  

