import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import * as api from '../../../api';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline, EditLocationOutlined, PersonAddOutlined } from '@material-ui/icons';
import { escapeRegExp } from '../../../utils/funcUtils';
import { viewUtils } from '../../../utils/viewUtils';
import { useDispatch } from 'react-redux';

const UserManagement = ({ userType }) => {

    const columns = [
        {
            field: 'firstName',
            headerName: 'Họ',
            width: 200,
            editable: false,
        },
        {
            field: 'lastName',
            headerName: 'Tên',
            width: 200,
            editable: false,
        },
        {
            field: 'mail',
            headerName: 'Mail',
            width: 300,
            editable: false,
        },
        {
            field: 'userName',
            headerName: 'Tên đăng nhập',
            width: 200,
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            flex: 1,
            editable: false,
            renderCell: (params) => {
                return <Box>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Button title='Thêm mới' startIcon={<PersonAddOutlined />} />
                        </Grid>
                        <Grid item xs={4}>
                            <Button title='Chỉnh sửa' startIcon={<EditLocationOutlined />} />
                        </Grid>
                        <Grid item xs={4}>
                            <Button title='Xóa' onClick={() => openConfirmDeleteUser(params.id)} startIcon={<DeleteOutline />} />
                        </Grid>
                    </Grid>
                </Box>
            }
        }
    ]

    let [filters, setFilters] = useState({
        userType,
        firstName: '',
        lastName: '',
        userName: '',
        mail: ''
    })
    let [userList, setUserList] = useState([]);
    let dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            getData();
        });        
    }, [])

    let onChangeTextInput = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    let getData = async () => {
        let listData = await api.searchUsers(filters);
        setUserList([...listData.data.map(u => ({ ...u, id: u._id }))]);        
    }

    let deleteUser = async (userId) => {
        let resData = await api.deleteUser(userId);
        viewUtils.closeConfirm(dispatch);
        viewUtils.showAlert(dispatch, resData.data.message, 'success');
        getData();
    }

    let openConfirmDeleteUser = (userId) => {
        let selectedUser = userList.find(x => x._id == userId);
        viewUtils.openConfirm(dispatch, `Bạn xác nhận sẽ xóa user ${selectedUser.userName}?`, deleteUser, [userId]);        
    }

    return <Box my={2}>
        <Box mb={2}>
            <Card>
                <CardHeader title='Thông tin tìm kiếm' />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Họ"
                                name='firstName'
                                fullWidth
                                value={filters.firstName}
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Tên"
                                name='lastName'
                                value={filters.lastName}
                                fullWidth
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                name='mail'
                                fullWidth
                                value={filters.mail}
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Tên đăng nhập"
                                name='userName'
                                value={filters.userName}
                                fullWidth
                                onChange={onChangeTextInput}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Box display='flex' justifyContent='center' my={2} width="100%">
                        <Button title='Tìm kiếm' onClick={() => getData()} variant="contained" color="primary">Tìm kiếm</Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>
        <Box>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={userList}
                    columns={columns}
                    pageSize={5}
                />
            </div>
        </Box>
    </Box>
}

export default UserManagement;