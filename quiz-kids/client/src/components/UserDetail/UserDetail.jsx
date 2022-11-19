import { Avatar, Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Divider, Grid, Icon, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@material-ui/core';
import {
    AccessAlarm,
    UndoOutlined,
    LockOutlined
} from '@material-ui/icons';
import React, { Component } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { USERTYPES } from '../../constants/userTypes';
import ChangePassword from './ChangePassword/ChangePassword';

const defaultUser = {
    userType: USERTYPES.STUDENT,
    firstName: 'Nguyen',
    lastName: 'An',
    userName: 'anjione',
    mail: 'anjione@gmail.com'
}

const UserDetail = () => {

    let [user, setUser] = useState({});
    let [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
    
    useEffect(() => {
        setUser({
            ...defaultUser
        })
    }, [])

    let openChangePassword = () => {
        setIsOpenChangePassword(true);
    }

    let closeChangePassword = () => {
        setIsOpenChangePassword(false);
    }

    let submitChangePassword = ({oldPass, newPass}) => {
        setIsOpenChangePassword(false);
        console.log(oldPass, newPass);
    }

    let onChangeTextInput = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
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
                        Thông tin cá nhân
                    </Typography>
                    <Typography variant="body2" color="div">
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField required
                                    id="outlined-required"
                                    label="Họ"
                                    name='firstName'
                                    fullWidth
                                    value={user.firstName}
                                    onChange={onChangeTextInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField required
                                    id="outlined-required"
                                    label="Tên"
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
                                Đổi mật khẩu
                            </Button>
                            <ChangePassword onClose={closeChangePassword} isOpen={isOpenChangePassword} onSubmit={submitChangePassword} />
                        </Grid>
                        <Grid item xs={6}>
                            <Button size="small" color="secondary" startIcon={<UndoOutlined />} style={{ marginRight: '15px' }}>
                                Hủy bỏ các thay đổi
                            </Button>
                            <Button size="small" color="primary" startIcon={<AccessAlarm />}>
                                Lưu thay đổi
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
        <Grid item md={6}>
            <Box mb={2}>
                <Card>
                    <CardHeader title={'Quizz statistic'} />
                    <CardContent>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="assets/img1.jpeg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Brunch this weekend?"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Ali Connors
                                            </Typography>
                                            {" — I'll be in your neighborhood doing errands this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Travis Howard" src="assets/img1.jpeg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Summer BBQ"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                to Scott, Alex, Jennifer
                                            </Typography>
                                            {" — Wish I could come, but I'm out of town this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box my={2}>
                <Card>
                    <CardHeader title={'Quizz statistic'} />
                    <CardContent>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Brunch this weekend?"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                Ali Connors
                                            </Typography>
                                            {" — I'll be in your neighborhood doing errands this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Summer BBQ"
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                to Scott, Alex, Jennifer
                                            </Typography>
                                            {" — Wish I could come, but I'm out of town this…"}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    </Grid>
}

export default UserDetail;