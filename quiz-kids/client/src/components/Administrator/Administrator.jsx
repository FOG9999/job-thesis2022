import { Container, Paper, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Dashboard from './Dashboard/Dashboard';
import StudentManagement from './StudentManagement/StudentManagement';
import TeacherManagement from './TeacherManagement/TeacherManagement';

const Administrator = () => {

    const [tabIndex, setTabIndex] = React.useState(0);
    useEffect(() => {
        console.log('init')
    }, [])

    const handleChangeTab = (event, newValue) => {
        setTabIndex(newValue);
    };

    return <Paper square>
        <Container>
            <Tabs
                value={tabIndex}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
                aria-label="disabled tabs example"
                style={{marginTop: '30px'}}
            >
                <Tab label="Dashboard" />
                <Tab label="Quản lý giáo viên" />
                <Tab label="Quản lý học sinh" />
            </Tabs>
            <div role="tabpanel" style={{minHeight: '80vh'}}>
                {
                    tabIndex == 0 ?
                        <Dashboard />
                        :
                        (
                            tabIndex == 1 ?
                                <TeacherManagement /> : <StudentManagement />
                        )
                }
            </div>
        </Container>
    </Paper>
}

export default Administrator;