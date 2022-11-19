import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { viewUtils } from "../../utils/viewUtils";

const { Dialog } = require("@material-ui/core")

const AlertCommon = ({message, type, isOpen}) => {

    let dispatch = useDispatch();
    let closeDialog = () => {
        viewUtils.closeAlert(dispatch);
    }

    return <Dialog open={isOpen} onClose={() => closeDialog()}>
        <Alert severity={type}>{message}</Alert>
    </Dialog>
}

export default AlertCommon;