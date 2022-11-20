import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@material-ui/core";
import { CloseOutlined, SaveOutlined } from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react"
import { useDispatch } from "react-redux";
import * as api from '../../../api'
import { viewUtils } from "../../../utils/viewUtils";

const UserDialog = ({ id, isOpen, onClose, onSubmit }) => {
    let dispatch = useDispatch();
    let [userModel, setUserModel] = useState({});
    let [confirmPassword, setConfirmPassword] = useState("");
    let [invalid, setInvalid] = useState(false)

    useEffect(() => {
        if (id)
            getUserData();
        else {
            setUserModel({})
        }
    }, [id])

    // useEffect(() => {
    //     checkValid();
    // }, [userModel])

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
                                value={userModel.firstName}
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField required
                                id="outlined-required"
                                label="Tên"
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
                                        autocomplete="off"
                                        label="Password"
                                        name='password'
                                        value={userModel.password}
                                        onChange={onChangeTextInput}
                                        fullWidth
                                    />
                                </Box>
                                <Box mt={2}>
                                    <TextField required
                                        id="outlined-required"
                                        autocomplete="new-password"
                                        label="Confirm password"
                                        name='confirmPassword'
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