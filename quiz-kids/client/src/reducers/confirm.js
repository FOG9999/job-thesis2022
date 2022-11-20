const { CONFIRM_TOGGLE } = require("../constants/actionTypes");

const confirmReducer = (state = {isShow: false, message: '', callback: () => {}}, action) => {
    switch(action.type) {
        case CONFIRM_TOGGLE: {
            return {
                ...state,
                isShow: action.data.isOpen,
                message: action.data.message,
                callback: action.data.callback
            }
        }
        default: {
            return state;
        }
    }
}

export default confirmReducer;