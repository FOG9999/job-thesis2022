import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@material-ui/core";
import { CloseOutlined, SaveOutlined } from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react"
import { useDispatch } from "react-redux";
import * as api from '../../../api'
import * as validationFuncs from "../../../utils/funcUtils";
import { viewUtils } from "../../../utils/viewUtils";

const UserDialog = ({ id, isOpen, onClose, onSubmit }) => {
    let dispatch = useDispatch();
    let [userModel, setUserModel] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        mail: '',
        password: ''
    });
    let [confirmPassword, setConfirmPassword] = useState("");
    let [validation] = useState(validationFuncs);
    let [invalid, setInvalid] = useState(false);
    let [errorFirstName, setErrorFirstName] = useState(false);
    let [errorLastName, setErrorLastName] = useState(false);
    let [errorUserName, setErrorUserName] = useState(false);
    let [errorMail, setErrorMail] = useState(false);
    let [errorPassword, setErrorPassword] = useState(false);
    let [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

    useEffect(() => {
        if (id) {
            getUserData();
            setInvalid(false);
        }
        else {
            setUserModel({
                firstName: '',
                lastName: '',
                userName: '',
                mail: '',
                password: ''
            });
        }
        setErrorFirstName(false);
        setErrorLastName(false);
        setErrorUserName(false);
        setErrorMail(false);
        setErrorPassword(false);
        setErrorConfirmPassword(false);
    }, [id])

    let checkValid = (inputName, val) => {
        let tail = inputName.charAt(0).toUpperCase() + inputName.substring(1, inputName.length);
        let funcName = 'setError' + tail;
        if(eval(funcName)){
            if(['firstName', 'lastName'].indexOf(inputName) >= 0){
                eval(funcName)(!validation.validateName(val))
            }
            else {
                eval(funcName)(!validation[`validate${tail}`](val));
            }
        }
    }

    let getUserData = async () => {
        let userData = await api.getUser(id);
        if (userData.data.message) {
            viewUtils.showAlert(dispatch, userData.data.message, 'error');
        }
        else setUserModel({
            ...userData.data
        })
    }

    let onChangeTextInput = (e) => {
        setUserModel({
            ...userModel,
            [e.target.name]: e.target.value
        })
        if (e.target.name == 'confirmPassword') {
            setConfirmPassword(e.target.value);
        }
        checkValid(e.target.name, e.target.value);
    }

    return <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>
            {id ? 'Cập nhật thông tin người dùng' : 'Thêm mới người dùng'}
        </DialogTitle>
        <DialogContent>
            <Box p={2} minWidth="200px">
                <Typography variant="body2" color="div">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField required
                                id="outlined-required"
                                label="Họ"
                                name='firstName'
                                fullWidth
                                error={errorFirstName}
                                helperText={errorFirstName ? 'Họ không hợp lệ': ''}
                                value={userModel.firstName}
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField required
                                id="outlined-required"
                                label="Tên"
                                error={errorLastName}
                                helperText={errorLastName ? 'Tên không hợp lệ': ''}
                                name='lastName'
                                value={userModel.lastName}
                                fullWidth
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                    </Grid>
                    <Box my={2}>
                        <TextField required
                            id="outlined-required"
                            label="Email"
                            name='mail'
                            error={errorMail}
                            helperText={errorMail ? 'Email không hợp lệ': ''}
                            value={userModel.mail}
                            fullWidth
                            onChange={onChangeTextInput}
                        />
                    </Box>
                    <Box mt={2}>
                        <TextField required
                            id="outlined-required"
                            label="Username"
                            name='userName'
                            error={errorUserName}
                            helperText={errorUserName ? 'Tên đăng nhập không hợp lệ': ''}
                            value={userModel.userName}
                            onChange={onChangeTextInput}
                            fullWidth
                            disabled={id ? true : false}
                        />
                    </Box>
                    {
                        id ? <></> :
                            (<>
                                <Box mt={2}>
                                    <TextField required
                                        id="outlined-required"
                                        type='password'
                                        inputProps={{autoCompplete: 'off'}}
                                        label="Password"
                                        name='password'
                                        error={errorPassword}
                                        helperText={errorPassword ? 'Password đủ chữ thường, in hoa, số và ký tự đặc biệt': ''}
                                        value={userModel.password}
                                        onChange={onChangeTextInput}
                                        fullWidth
                                    />
                                </Box>
                                <Box mt={2}>
                                    <TextField required
                                        id="outlined-required"
                                        autoComplete="new-password"
                                        label="Confirm password"
                                        name='confirmPassword'
                                        error={errorConfirmPassword}
                                        helperText={errorConfirmPassword ? 'Xác nhận lại mât khẩu': ''}
                                        value={confirmPassword}
                                        onChange={onChangeTextInput}
                                        fullWidth
                                    />
                                </Box>
                            </>)
                    }

                </Typography>
            </Box>
        </DialogContent>
        <DialogActions>
            <Box display='flex' justifyContent='right' pr={2}>
                <Button size="small" color="secondary" startIcon={<CloseOutlined />} style={{ marginRight: '15px' }} onClick={() => onClose()}>
                    Đóng
                </Button>
                <Button size="small" color="primary" startIcon={<SaveOutlined />} onClick={() => onSubmit(userModel)}>
                    Lưu
                </Button>
            </Box>
        </DialogActions>
    </Dialog>
}

export default UserDialog;