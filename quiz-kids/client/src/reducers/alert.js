const { ALERT_TOGGLE } = require("../constants/actionTypes");

const alertReducer = (state = {isShow: false, message: '', type: 'info'}, action) => {
    switch(action.type) {
        case ALERT_TOGGLE: {
            return {
                ...state,
                isShow: action.data.isOpen,
                message: action.data.message,
                type: action.data.type
            }
        }
        default: {
            return state;
        }
    }
}

export default alertReducer;