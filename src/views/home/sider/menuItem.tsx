import {
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  ProjectOutlined,
  UserOutlined,
  SmileOutlined,
  ContainerOutlined,
  CommentOutlined,
  RocketOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
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
  let role = sessionStorage.getItem('roleId');
  let items: ItemType[] = [];

  if (role === '1' || role === '2') {
    items = [
      getItem('首页', 'menu5', <HomeOutlined rev={undefined} />),
      getItem('娱乐项目管理', 'menu6', <ProjectOutlined rev={undefined} />),
      getItem('门票管理', 'menu7', <ContainerOutlined rev={undefined} />),
      getItem('设施管理', 'menu8', <RocketOutlined rev={undefined} />),
      getItem('留言板', 'menu9', <CommentOutlined rev={undefined} />),
      getItem('游客管理', 'menu10', <SmileOutlined rev={undefined} />),
      getItem('权限管理', '', <SettingOutlined rev={undefined} />, [
        getItem('账号管理', 'menu2', <UserOutlined rev={undefined} />),
        getItem('系统角色', 'menu3', <TeamOutlined rev={undefined} />),
      ]),
      getItem('退出', 'menu4', <LogoutOutlined rev={undefined} />),
    ];
  } else if (role === '3' || role === '4' || role === '5' || role === '6') {
    items = [
      getItem('首页', 'menu5', <HomeOutlined rev={undefined} />),
      getItem('设施管理', 'menu8', <RocketOutlined rev={undefined} />),
      getItem('留言板', 'menu9', <CommentOutlined rev={undefined} />),
      getItem('退出', 'menu4', <LogoutOutlined rev={undefined} />),
    ];
  } else if (role === '7') {
    items = [
      getItem('首页', 'menu5', <HomeOutlined rev={undefined} />),
      getItem('门票管理', 'menu7', <ContainerOutlined rev={undefined} />),
      getItem('留言板', 'menu9', <CommentOutlined rev={undefined} />),
      getItem('退出', 'menu4', <LogoutOutlined rev={undefined} />),
    ];
  }

  return items;
}
