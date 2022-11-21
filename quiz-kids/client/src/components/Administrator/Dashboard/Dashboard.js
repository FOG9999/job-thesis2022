import { Box, Card, CardContent, CardHeader, Container, Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import * as api from '../../../api'
import Highcharts from 'highcharts';
// Alternatively, this is how to load Highcharts Stock. The Maps and Gantt
// packages are similar.
// import Highcharts from 'highcharts/highstock';

// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';

const Dashboard = () => {

    let [chartData, setChartData] = useState({
        numOfStudents: 1,
        numOfTeachers: 1
    });

    useEffect(() => {
        getDataChart()
    }, [])

    useEffect(() => {
        drawChart();
    }, [chartData])

    let getDataChart = async () => {
        let data = await api.getChartDashboard();
        console.log(data);
        setChartData(data.data);
    }

    let drawChart = () => {
        let transformedData = [];
        transformedData.push(
            {
                name: 'Giáo viên',
                y: chartData.numOfTeachers / (chartData.numOfStudents + chartData.numOfTeachers)
            },
            {
                name: 'Học viên',
                y: chartData.numOfStudents / (chartData.numOfStudents + chartData.numOfTeachers)
            }
        )
        Highcharts.chart('chart-dashboard', {
            // options - see https://api.highcharts.com/highcharts
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Thống kê người dùng'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Số lượng',
                colorByPoint: true,
                data: [...transformedData]
            }]
        });
    }

    return <Box p={2}>
        <Container>
            <Grid container>
                <Grid item md={6} sm={12}>
                    <Box p={1} width='100%' height='100%'>
                        <Card>
                            <CardHeader style={{ textAlign: 'center' }}>Số lượng giáo viên</CardHeader>
                            <CardContent>
                                {chartData.numOfStudents + chartData.numOfTeachers > 0 ? <div id='chart-dashboard'></div> : <></>}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Box p={1} width='100%'>
                        <Card style={{ width: '100%' }}>
                            <CardHeader title='Số lượng giáo viên' style={{ textAlign: 'center' }} />
                            <CardContent>
                                <Box display='flex' justifyContent='center'>
                                    <Typography variant="h5" component="div">
                                        <b style={{fontSize: '40px'}}>{chartData.numOfTeachers}</b>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        <Card style={{ marginTop: '20px', width: '100%' }}>
                            <CardHeader title='Số lượng học viên' style={{ textAlign: 'center' }} />
                            <CardContent>
                                <Box display='flex' justifyContent='center'>
                                    <Typography variant="h5" component="div">
                                        <b style={{fontSize: '40px'}}>{chartData.numOfStudents}</b>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </Box>
}

export default Dashboard;