import { Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, Icon, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@material-ui/core';
import {
    AccessAlarm,
    UndoOutlined,
    LockOutlined,
    SaveOutlined
} from '@material-ui/icons';
import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { USERTYPES } from '../../constants/userTypes';
import ChangePassword from './ChangePassword/ChangePassword';
import * as api from '../../api/index'
import { viewUtils } from '../../utils/viewUtils';
import { AUTH, LOGOUT } from '../../constants/actionTypes';
import { ALERT_SHOWTIME } from '../../constants/consts';
import { toggleConfirm } from '../../actions/confirm';

const defaultUser = {
    userType: null,
    firstName: 'Nguyen',
    lastName: 'An',
    userName: 'anjione',
    mail: 'anjione@gmail.com'
}

const UserDetail = () => {

    let [user, setUser] = useState({ ...defaultUser });
    let [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
    let [submitIsDisabled, setSubmitIsDisabled] = useState(true);
    let [userHistory, setUserHistory] = useState([]);

    let dispatch = useDispatch();
    let userStore = useSelector(state => state.auth.authData);

    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('profile'));
        if (userData.result) {
            getHistory(userData.result);
            setUser({
                ...userData.result
            })
        }

    }, [userStore]);

    let openChangePassword = () => {
        setIsOpenChangePassword(true);
    }

    let getHistory = async (userData) => {
        let res = await api.getUserHistory(userData._id);
        if (res.data.message) {
            viewUtils.showAlert(dispatch, res.data.message, 'error');
        }
        else {
            let cloneHistory = [];
            if(userData.userType == 'Student'){
                let { listJoinedGames, listScores } = res.data;
                listJoinedGames.forEach(game => {
                    let score = listScores.filter(sc => sc.gameId == game._id)[0];
                    cloneHistory.push({
                        score: score? score.score : 0,
                        pin: game.pin,
                        date: new Date(game.date)
                    })
                });
            }
            else if(userData.userType == 'Teacher') {
                let { listGamesHost } = res.data;
                listGamesHost.forEach(game => {
                    cloneHistory.push({
                        numOfPalyers: game.playerList.length,
                        pin: game.pin,
                        date: new Date(game.date)
                    })
                });
            }
            setUserHistory([...cloneHistory]);
        }
    }

    let closeChangePassword = () => {
        setIsOpenChangePassword(false);
    }

    let submitChangePassword = async ({ oldPass, newPass }) => {
        try {
            let res = await api.changePassword(user._id, oldPass, newPass);
            if (res.data.message) {
                viewUtils.showAlert(dispatch, res.data.message, 'error');
                return;
            }
            else {
                viewUtils.showAlert(dispatch, 'C???p nh???t m???t kh???u th??nh c??ng. Vui l??ng ????ng nh???p l???i');

                setTimeout(() => {
                    dispatch({ type: LOGOUT });
                    window.location.href = '/auth';
                }, ALERT_SHOWTIME);
            }
        } catch (error) {
            viewUtils.showAlert(dispatch, 'C?? l???i x???y ra. Vui l??ng th??? l???i', 'error')
        }
        setIsOpenChangePassword(false);
    }

    let onChangeTextInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
        setSubmitIsDisabled(false);
    }

    let updateUser = async () => {
        let res = await api.updateUser(user._id, user);
        if (res.data.message) {
            viewUtils.showAlert(dispatch, res.data.message, 'error');
        }
        else {
            viewUtils.showAlert(dispatch, 'Update user th??nh c??ng', 'success');
            updateUserClient(res.data);
        }
        viewUtils.closeConfirm(dispatch);
    }

    let updateUserClient = (updatedUser) => {
        let userData = JSON.parse(localStorage.getItem('profile'));
        userData.result = {
            ...userData.result,
            ...updatedUser
        }
        dispatch({ type: AUTH, data: userData });
        setSubmitIsDisabled(true);
    }

    let cancelChanges = () => {
        let userData = JSON.parse(localStorage.getItem('profile'));
        if (userData.result) {
            setUser({
                ...userData.result
            })
        }
        setSubmitIsDisabled(true);
        viewUtils.closeConfirm(dispatch);
    }

    let openConfirmChanges = () => {
        viewUtils.openConfirm(dispatch, 'B???n x??c nh???n mu???n l??u c??c thay ?????i?', updateUser);
    }

    let openConfirmDiscardChanges = () => {
        viewUtils.openConfirm(dispatch, 'B???n x??c nh???n mu???n h???y b??? c??c thay ?????i?', cancelChanges);
    }

    let displayStudentHistory = () => {
        return userHistory.map((h => {
            return <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="assets/img1.jpeg" />
                </ListItemAvatar>
                <ListItemText
                    primary={`B???n ???? tham gia room ${h.pin}`}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                v??o l??c {h.date.toLocaleDateString() + ' ' + h.date.toLocaleTimeString()}
                            </Typography>
                            <span style={{color: 'green'}}>{` ??? K???t qu???: ${h.score} ??i???m`}</span>
                        </React.Fragment>
                    }
                />
            </ListItem>
        }))
    }

    let displayTeacherHistory = () => {
        return userHistory.map((h => {
            return <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="assets/img1.jpeg" />
                </ListItemAvatar>
                <ListItemText
                    primary={`B???n ???? t???o room ${h.pin}`}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                v??o l??c {h.date.toLocaleDateString() + ' ' + h.date.toLocaleTimeString()}
                            </Typography>
                            <span style={{color: 'green'}}>{` ??? S??? ng?????i tham gia: ${h.numOfPalyers}`}</span>
                        </React.Fragment>
                    }
                />
            </ListItem>
        }))
    }

    return <Grid container spacing={5} style={{ marginTop: '6vh', width: '`00%', padding: '0px 20px 20px 20px' }}>
        <Grid item md={6}>
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image="/images/img1.jpeg"
                    alt="green iguana"

                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Th??ng tin c?? nh??n
                    </Typography>
                    <Typography variant="body2" color="div">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField required
                                    id="outlined-required"
                                    label="H???"
                                    name='firstName'
                                    fullWidth
                                    value={user.firstName}
                                    onChange={onChangeTextInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField required
                                    id="outlined-required"
                                    label="T??n"
                                    name='lastName'
                                    value={user.lastName}
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
                                value={user.mail}
                                fullWidth
                                onChange={onChangeTextInput}
                            />
                        </Box>
                        <Box mt={2}>
                            <TextField required
                                id="outlined-required"
                                label="Username"
                                name='userName'
                                value={user.userName}
                                fullWidth
                                disabled
                            />
                        </Box>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Grid container >
                        <Grid item xs={6}>
                            <Button size="small" color="primary" startIcon={<LockOutlined />} onClick={() => openChangePassword()}>
                                ?????i m???t kh???u
                            </Button>
                            <ChangePassword onClose={closeChangePassword} isOpen={isOpenChangePassword} onSubmit={submitChangePassword} />
                        </Grid>
                        <Grid item xs={6}>
                            <Button size="small" color="secondary" startIcon={<UndoOutlined />} style={{ marginRight: '15px' }} disabled={submitIsDisabled} onClick={() => openConfirmDiscardChanges()}>
                                H???y b??? c??c thay ?????i
                            </Button>
                            <Button size="small" color="primary" startIcon={<SaveOutlined />} disabled={submitIsDisabled} onClick={() => openConfirmChanges()}>
                                L??u thay ?????i
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
        <Grid item md={6}>
            <Box mb={2}>
                <Card>
                    <CardHeader title={'L???ch s??? tham gia'} />
                    <CardContent style={{maxHeight: '500px', overflowY: 'auto'}}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {
                                user.userType == 'Student' ? displayStudentHistory() : displayTeacherHistory()
                            }
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    </Grid>
}

export default UserDetail;