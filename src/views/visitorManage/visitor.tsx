import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';

const initialVisitors = [
    { id: 1, name: '游客1', email: 'youke1@example.com' },
    { id: 2, name: '游客2', email: 'youke2@example.com' },
    // 添加更多游客...
];

const VisitorManage = () => {
    const [visitors, setVisitors] = useState(initialVisitors);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentVisitor, setCurrentVisitor] = useState<any>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setCurrentVisitor(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (visitor: any) => {
        setCurrentVisitor(visitor);
        form.setFieldsValue(visitor);
        setModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setVisitors(visitors.filter((visitor) => visitor.id !== id));
        notification.success({ message: '游客信息删除成功!' });
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            if (currentVisitor) {
                // 编辑操作
                setVisitors(visitors.map((v) => v.id === currentVisitor.id ? { ...values, id: currentVisitor.id } : v));
                notification.success({ message: '游客信息修改成功!' });
            } else {
                // 添加操作
                const newVisitor = { ...values, id: Date.now() };
                setVisitors([...visitors, newVisitor]);
                notification.success({ message: '游客信息添加成功!' });
            }
            setModalVisible(false);
        });
    };

    const columns = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (_: any, record: { id: any; }) => (
                <>
                    <Button onClick={() => handleEdit(record)}>编辑</Button>
                    <Button onClick={() => handleDelete(record.id)}>删除</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={handleAdd}>添加游客</Button>
            <Table columns={columns} dataSource={visitors} rowKey="id" style={{ marginTop: 16 }} />
            <Modal title={currentVisitor ? '编辑游客信息' : '添加游客信息'} visible={modalVisible} onOk={handleSave} onCancel={() => setModalVisible(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default VisitorManage;
