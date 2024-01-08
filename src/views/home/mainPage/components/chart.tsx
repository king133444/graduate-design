import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
    { name: 'Jan', visitors: 4000, tickets: 2400 },
    { name: 'Feb', visitors: 3000, tickets: 1398 },
    { name: 'Mar', visitors: 2000, tickets: 9800 },
    // Add more data as needed
];

const Chart = () => (
    <LineChart width={500} height={300} data={data}>
        <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
        <Line type="monotone" dataKey="tickets" stroke="#82ca9d" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
    </LineChart>
);

export default Chart;
