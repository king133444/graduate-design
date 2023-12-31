import {
  SettingOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  disable?: boolean,
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled: disable ?? false,
  } as MenuItem;
}

export default function getItems() {

  const items = [
    getItem('权限管理', 'menu1', <SettingOutlined rev={undefined} />, [
      getItem('账号管理', 'menu2'),
      getItem('系统角色', 'menu3'),
    ]),
    getItem('个人信息管理', 'menu10', <SolutionOutlined rev={undefined} />),
  ]
  return items;
}
