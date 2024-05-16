import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { message } from 'antd';
import api from '@/api';

const roles = [
  '管理员',
  '经理',
  '设备采购人员',
  '设备维修人员',
  '设备检查人员',
  '设备供应商',
  '游客',
];

const UserStatistics: React.FC = () => {
  const [userData, setUserData] = useState<{ name: string; value: number }[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUserStatistics = async () => {
    try {
      const result: any = await api.GetUserStatistics({});

      const { success, data, message: info } = result;
      if (success) {

        const formattedData = data.roleCounts.map((value: any, index: any) => ({
          name: roles[index],
          value
        }));
        setUserData(formattedData);
        setTotalUsers(data.total);
      } else {
        message.error(info)
      }
    } catch (error) {
      message.error('获取失败')
    }
  };
  useEffect(() => {
    getUserStatistics();

  }, []);

  const pieOptions = {
    title: {
      text: '角色分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '用户数量',
        type: 'pie',
        radius: '50%',
        data: userData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div>
      <h2>用户统计</h2>
      <div style={{ fontSize: '2em', margin: '20px 0' }}>
        注册用户总数: {totalUsers}
      </div>
      <ReactECharts option={pieOptions} style={{ height: 400, width: '100%' }} />
    </div>
  );
};

export default UserStatistics;
