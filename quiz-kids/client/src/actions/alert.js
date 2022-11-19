import { ALERT_TOGGLE } from "../constants/actionTypes"

export const toggleAlert = ({ message, type, isOpen }) => (dispatch) => {
    dispatch({
        type: ALERT_TOGGLE,
        data: {message, type, isOpen}
    })
}