import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { sidebarItems } from '../../constant/sidebarItems';
import { useAppDispatch } from '../../redux/hooks';
import { logoutUser } from '../../redux/services/authSlice';

import './Sidebar.css'; // Import the custom CSS

const { Content, Sider } = Layout;

const Sidebar = () => {
  const [showLogoutBtn, setShowLogoutBtn] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onCollapse={(collapsed, type) => {
          if (type === 'responsive' || type === 'clickTrigger') {
            setShowLogoutBtn(!collapsed);
          }
        }}
        width='320px'
        className='custom-sidebar'
      >
        <div className='sidebar-header'>
          <h1>Stock-Wise</h1>
        </div>

        <Menu
          theme='dark'
          mode='inline'
          className='custom-menu'
          defaultSelectedKeys={['Dashboard']}
          items={sidebarItems}
        />

        {showLogoutBtn && (
          <div className='logout-container'>
            <Button
              className='logout-button'
              onClick={handleClick}
              icon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </div>
        )}
      </Sider>

      <Layout>
        <Content style={{ padding: '2rem', background: '#BBE1FA' }}>
          <div
            style={{
              padding: '1rem',
              maxHeight: 'calc(100vh - 4rem)',
              minHeight: 'calc(100vh - 4rem)',
              background: '#fff',
              borderRadius: '1rem',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
