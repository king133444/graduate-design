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
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: 'Reserved' } : t));
        notification.success({ message: 'Ticket reserved successfully!' });
    };

    const handleSale = (id: number) => {
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: 'Sold' } : t));
        notification.success({ message: 'Ticket sold successfully!' });
    };

    const handleRefund = (id: number) => {
        setTickets(tickets.map((t) => t.id === id ? { ...t, status: 'Available' } : t));
        notification.success({ message: 'Ticket refunded successfully!' });
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_: any, record: { id: any; }) => (
                <>
                    <Button onClick={() => handleReserve(record.id)}>Reserve</Button>
                    <Button onClick={() => handleSale(record.id)}>Sell</Button>
                    <Button onClick={() => handleRefund(record.id)}>Refund</Button>
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
