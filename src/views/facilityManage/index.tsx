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
        setEquipments(equipments.map((e) => e.id === id ? { ...e, status: '购买' } : e));
        notification.success({ message: 'Equipment purchased successfully!' });
    };

    const handleRepair = (id: number) => {
        setEquipments(equipments.map((e) => e.id === id ? { ...e, status: '维修中' } : e));
        notification.success({ message: 'Equipment sent for repair successfully!' });
    };

    const columns = [
        { title: '设备名', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (_: any, record: { id: any; }) => (
                <>
                    <Button onClick={() => handlePurchase(record.id)}>购买</Button>
                    <Button onClick={() => handleRepair(record.id)}>维修</Button>
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
