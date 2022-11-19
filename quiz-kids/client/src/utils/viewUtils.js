import { toggleAlert } from "../actions/alert";
import { ALERT_SHOWTIME } from "../constants/consts";

const viewUtils = {
    showAlert: (dispatch, message, type = 'info') => {
        dispatch(toggleAlert({ message, isOpen: true, type }))
    },
    closeAlert: (dispatch) => {
        dispatch(toggleAlert({ message: '', isOpen: false, type: '' }))
    }
}

export { viewUtils };