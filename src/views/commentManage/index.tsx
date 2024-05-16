import React, { useState } from 'react';
import { Table, Button, notification } from 'antd';

const initialComments = [
  { id: 1, user: 'User 1', comment: 'Great amusement park!', date: '2024-03-18' },
  { id: 2, user: 'User 2', comment: 'Had a fantastic time!', date: '2024-03-17' },
  // 添加更多留言...
];

const CommentManage = () => {
  const [comments, setComments] = useState(initialComments);

  const handleDelete = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
    notification.success({ message: 'Comment deleted successfully!' });
  };

  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_: any, record: { id: any; }) => (
        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={comments} rowKey="id" />
    </>
  );
};

export default CommentManage;
