import React, { useState } from 'react';
import { Table, Button, notification } from 'antd';

const initialEquipments = [
    { id: 1, name: 'Equipment 1', status: 'Available' },
    { id: 2, name: 'Equipment 2', status: 'Available' },
    // 添加更多设备...
];

const FacilityManage = () => {
    const [equipments, setEquipments] = useState(initialEquipments);

    const handlePurchase = (id: number) => {
        setEquipments(equipments.map((e) => e.id === id ? { ...e, status: 'Purchased' } : e));
        notification.success({ message: 'Equipment purchased successfully!' });
    };

    const handleRepair = (id: number) => {
        setEquipments(equipments.map((e) => e.id === id ? { ...e, status: 'Under Repair' } : e));
        notification.success({ message: 'Equipment sent for repair successfully!' });
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
                    <Button onClick={() => handlePurchase(record.id)}>Purchase</Button>
                    <Button onClick={() => handleRepair(record.id)}>Repair</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={equipments} rowKey="id" />
        </>
    );
};

export default FacilityManage;
