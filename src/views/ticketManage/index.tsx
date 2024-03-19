import React, { useState } from 'react';
import { Table, Button, notification } from 'antd';

const initialTickets = [
    { id: 1, name: 'Ticket 1', status: 'Available' },
    { id: 2, name: 'Ticket 2', status: 'Available' },
    // 添加更多门票...
];

const TicketManage = () => {
    const [tickets, setTickets] = useState(initialTickets);

    const handleReserve = (id: number) => {
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: '预定' } : t));
        notification.success({ message: 'Ticket reserved successfully!' });
    };

    const handleSale = (id: number) => {
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: '售出' } : t));
        notification.success({ message: 'Ticket sold successfully!' });
    };

    const handleRefund = (id: number) => {
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: '有票' } : t));
        notification.success({ message: 'Ticket refunded successfully!' });
    };

    const columns = [
        { title: '票种', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_: any, record: { id: any; }) => (
                <>
                    <Button onClick={() => handleReserve(record.id)}>预定</Button>
                    <Button onClick={() => handleSale(record.id)}>售出</Button>
                    <Button onClick={() => handleRefund(record.id)}>退票</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={tickets} rowKey="id" />
        </>
    );
};

export default TicketManage;
