import { Box } from '@material-ui/core'
import React from 'react'
import UserManagement from '../UserManagement/UserManagement';

const TeacherManagement = () => {
    return <Box p={2}>
        <UserManagement userType='Teacher' />
    </Box>
}

export default TeacherManagement;