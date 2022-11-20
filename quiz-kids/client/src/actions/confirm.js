import { CONFIRM_TOGGLE } from "../constants/actionTypes"

export const toggleConfirm = ({ message, callback, isOpen }) => (dispatch) => {
    dispatch({
        type: CONFIRM_TOGGLE,
        data: {message, callback, isOpen}
    })
}