import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface TicketRecord {
    date: string;
    sales: number;
    revenue: number;
}

const TicketSales: React.FC = () => {
    const [ticketData, setTicketData] = useState<TicketRecord[]>([]);
    const [totalSales, setTotalSales] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);

    useEffect(() => {
        // 模拟数据获取
        const fetchData = async () => {
            // 模拟的门票数据
            const data: TicketRecord[] = [
                { date: '2024-05-10', sales: 120, revenue: 2400 },
                { date: '2024-05-11', sales: 150, revenue: 3000 },
                { date: '2024-05-12', sales: 170, revenue: 3400 },
                { date: '2024-05-13', sales: 200, revenue: 4000 },
                { date: '2024-05-14', sales: 220, revenue: 4400 }, // 假设今天是2024-05-14
            ];

            const totalSalesCount = data.reduce((acc, record) => acc + record.sales, 0);
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = data.find(record => record.date === today);
            const todaySalesCount = todayRecord ? todayRecord.sales : 0;
            const todayRevenueCount = todayRecord ? todayRecord.revenue : 0;

            setTicketData(data);
            setTotalSales(totalSalesCount);
            setTodaySales(todaySalesCount);
            setTodayRevenue(todayRevenueCount);
        };

        fetchData();
    }, []);

    const lineOptions = {
        title: {
            text: '门票销售趋势',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ticketData.map(record => record.date),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '销售量',
                type: 'line',
                data: ticketData.map(record => record.sales),
            },
            {
                name: '收入',
                type: 'line',
                data: ticketData.map(record => record.revenue),
            },
        ],
    };

    return (
        <div>
            <h2>门票销售</h2>
            <div style={{ fontSize: '2em', margin: '20px 0' }}>
                总门票销售量: {totalSales}
            </div>
            <div style={{ fontSize: '1.5em', margin: '20px 0' }}>
                当日销售量: {todaySales}
            </div>
            <div style={{ fontSize: '1.5em', margin: '20px 0' }}>
                当日收入: ¥{todayRevenue}
            </div>
            <ReactECharts option={lineOptions} style={{ height: 400, width: '100%' }} />
        </div>
    );
};

export default TicketSales;
