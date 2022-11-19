import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';

const ChangePassword = ({ onClose, isOpen, onSubmit }) => {

    let [oldPass, setOldPass] = useState("");
    let [newPass, setNewPass] = useState("");

    let onChangeTextInput = (e) => {
        // <input name="oldPass"/> -> funcName='set'+OldPass'
        let funcName = 'set' + e.target.name.split('').map((val, ind) => {
            if (ind > 0) return val;
            else return val.toUpperCase();
        }).join('');

        if (funcName) {
            eval(funcName)(e.target.value);
        }
    }

    return <Dialog onClose={onClose} open={isOpen} maxWidth='lg'>
        <DialogTitle id='changepass-dialog-title'>
            Change password
        </DialogTitle>
        <DialogContent>
            <Box my={2} width="50vw" maxWidth='500px'>
                <TextField required
                    id="outlined-required"
                    label="Old password"
                    type='password'
                    autocomplete="new-password"
                    name='oldPass'
                    value={oldPass}
                    fullWidth
                    onChange={onChangeTextInput}
                />
            </Box>
            <Box mt={2}>
                <TextField required
                    id="outlined-required"
                    type='password'
                    label="New password"
                    name='newPass'
                    autocomplete="new-password"
                    value={newPass}
                    onChange={onChangeTextInput}
                    fullWidth
                />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={() => onSubmit({oldPass, newPass})} color="primary">
                Submit
            </Button>
        </DialogActions>
    </Dialog>
}

export default ChangePassword;