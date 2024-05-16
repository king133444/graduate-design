import ReactECharts from 'echarts-for-react';
import 'echarts/lib/chart/pie';

const PieChart = () => {
    const option = {
        title: {
            text: '旅客年龄'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '年龄',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 335, name: '0-20' },
                    { value: 310, name: '21-40' },
                    { value: 234, name: '41-60' },
                    { value: 135, name: '60+' }
                ]
            }
        ]
    };

    return <ReactECharts option={option} />;
};

export default PieChart;
