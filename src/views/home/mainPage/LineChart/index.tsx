import ReactECharts from 'echarts-for-react';
import 'echarts/lib/chart/line';

const LineChart = () => {
    const option = {
        title: {
            text: '年度售票情况'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [120, 200, 150, 80, 70, 110, 130, 150, 200, 240, 200, 220], // Sample data
            type: 'line'
        }],
        grid: { left: '50%' }
    };

    return (<ReactECharts option={option} />)
};

export default LineChart;
