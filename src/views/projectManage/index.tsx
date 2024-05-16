import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const initialProjects = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
    // 添加更多项目...
];

const ProjectManage = () => {
    const [projects, setProjects] = useState(initialProjects);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (id: any) => {
        setEditingId(id);
        const project = projects.find((p) => p.id === id);
        form.setFieldsValue(project);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setProjects(projects.filter((p) => p.id !== id));
        notification.success({ message: 'Project deleted successfully!' });
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                let updatedProjects;
                if (editingId) {
                    updatedProjects = projects.map((p) =>
                        p.id === editingId ? { ...p, ...values } : p
                    );
                } else {
                    const newProject = { id: Date.now(), ...values };
                    updatedProjects = [...projects, newProject];
                }
                setProjects(updatedProjects);
                setIsModalVisible(false);
                notification.success({ message: 'Project saved successfully!' });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (_: any, record: { id: any; }) => (
                <>
                    <Button onClick={() => handleEdit(record.id)}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <>
            <Button type="primary" icon={<PlusOutlined rev={undefined} />} onClick={handleAdd}>
                Add Project
            </Button>
            <Table columns={columns} dataSource={projects} rowKey="id" />
            <Modal
                title="Add/Edit Project"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input the project name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ProjectManage;
