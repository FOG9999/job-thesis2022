import { toggleAlert } from "../actions/alert";
import { toggleConfirm } from "../actions/confirm";
import { ALERT_SHOWTIME } from "../constants/consts";

const viewUtils = {
    showAlert: (dispatch, message, type = 'info') => {
        dispatch(toggleAlert({ message, isOpen: true, type }))
    },
    closeAlert: (dispatch) => {
        dispatch(toggleAlert({ message: '', isOpen: false, type: '' }))
    },
    openConfirm: (dispatch, message, callback = () => {}) => {
        dispatch(toggleConfirm({ message, isOpen: true, callback }))
    },
    closeConfirm: (dispatch) => {
        dispatch(toggleConfirm({ message: '', isOpen: false }))
    },
}

export { viewUtils };