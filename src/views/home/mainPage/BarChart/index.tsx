import ReactECharts from 'echarts-for-react';
import 'echarts/lib/chart/bar';

const BarChart = () => {
    const option = {
        title: {
            text: '设备购买及磨损情况'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['购买', '磨损']
        },
        xAxis: {
            type: 'category',
            data: ['设备1', '设备2', '设备3', '设备4', '设备5']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '购买',
                type: 'bar',
                data: [5, 20, 36, 10, 10] // Sample data
            },
            {
                name: '磨损',
                type: 'bar',
                data: [2, 5, 9, 4, 3] // Sample data
            }
        ]
    };

    return <ReactECharts option={option} />;
};

export default BarChart;
