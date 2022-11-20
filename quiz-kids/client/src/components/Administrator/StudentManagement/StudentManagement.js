import { Box } from '@material-ui/core'
import React from 'react'
import UserManagement from '../UserManagement/UserManagement';

const StudentManagement = () => {
    return <Box p={2}>
        <UserManagement userType='Student' />
    </Box>
}

export default StudentManagement;