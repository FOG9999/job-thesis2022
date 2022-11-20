import { Alert } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import { viewUtils } from "../../utils/viewUtils";

const { Dialog, DialogContent, DialogContentText, Button, DialogTitle, DialogActions } = require("@material-ui/core")

const ConfirmCommon = ({message, callback, isOpen, params}) => {

    let dispatch = useDispatch();
    let closeDialog = () => {
        viewUtils.closeConfirm(dispatch);
    }
    let confirm = () => {
        if(params.length){
            callback(...params);
        }
        else callback();
    }

    return <Dialog open={isOpen} onClose={() => closeDialog()}>
        <DialogTitle id="form-dialog-title">Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog()} color="primary">
            Đóng
          </Button>
          <Button onClick={() => confirm()} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
    </Dialog>
}

export default ConfirmCommon;