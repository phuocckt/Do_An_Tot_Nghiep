import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { RiCoupon2Fill } from "react-icons/ri";
import { BsCartPlus } from "react-icons/bs";
import { CiUser, CiViewList } from "react-icons/ci";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt, BiFontSize } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa6";
import { ImBullhorn } from "react-icons/im";
import { Layout, Menu, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice'; // Import the logout action
import { base_url } from '../utils/base_url';
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user); // Parse the user object
  const firstName = parsedUser?.firstname;
  const lastName = parsedUser?.lastname;
  const image = parsedUser?.images.map(image => image.url);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/'); // Redirect to the login page
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <h2 className='text-white fs-5 text-center py-2 mb-0'>
            <a href='/admin' className='text-decoration-none'><span className='sm-logo'>AD</span>
            <span className='lg-logo'>Admin</span></a>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['']}
          onClick={({ key }) => {
            if (key === "signout") {
              handleLogout(); // Call handleLogout on signout
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: '',
              icon: <AiOutlineDashboard className='fs-4' />,
              label: 'Dashboard',
            },
            {
              key: 'customers',
              icon: <CiUser className='fs-4' />,
              label: 'Customers',
            },
            {
              key: 'Product Management',
              icon: <AiOutlineShoppingCart className='fs-4' />,
              label: 'Product Management',
              children: [
                {
                  key: 'add-product',
                  icon: <BsCartPlus className='fs-4' />,
                  label: 'Add Product',
                },
                {
                  key: 'product',
                  icon: <CiViewList className='fs-4' />,
                  label: 'Product List',
                },
                {
                  key: 'add-brand',
                  icon: <BsCartPlus className='fs-4' />,
                  label: 'Add Brand',
                },
                {
                  key: 'brand-list',
                  icon: <SiBrandfolder className='fs-4' />,
                  label: 'Brand List',
                },
                {
                  key: 'add-category',
                  icon: <BsCartPlus className='fs-4' />,
                  label: 'Add Category',
                },
                {
                  key: 'category-list',
                  icon: <BiCategoryAlt className='fs-4' />,
                  label: 'Category List',
                },
                {
                  key: 'add-size',
                  icon: <BsCartPlus className='fs-4' />,
                  label: 'Add Size',
                },
                {
                  key: 'size-list',
                  icon: <BiFontSize className='fs-4' />,
                  label: 'Size List',
                }
              ]
            },
            {
              key: 'Marketing',
              icon: <ImBullhorn className='fs-4' />,
              label: 'Marketing',
              children: [
                {
                  key: 'add-coupon',
                  icon: <BsCartPlus className='fs-4' />,
                  label: 'Add Coupon',
                },
                {
                  key: 'coupon-list',
                  icon: <RiCoupon2Fill className='fs-4' />,
                  label: 'Coupon List',
                }
              ]
            },
            {
              key: 'orders',
              icon: <FaClipboardList className='fs-4' />,
              label: 'Orders',
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className='d-flex justify-content-between ps-1 pe-5'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <button className='trigger border-0' onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className='d-flex gap-2 align-items-center'>
            <div className='d-flex gap-2 align-items-center dropdown'>
              <div>
                <img 
                  width={32} 
                  height={32} 
                  src={image} 
                  alt=''/>
              </div>
              <div 
                role='button'
                id='dropdownMenuLink' 
                data-bs-toggle='dropdown' 
                aria-expanded='false'
                onClick={toggleDropdown} // Toggle dropdown on click
              >
                <h5 className='mb-0'>{firstName + " " + lastName}</h5>
              </div>
              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuLink">
                <li>
                  <Link 
                    className='dropdown-item py-1 mb-1'
                    style={{ height: "auto", lineHeight: "20px"}}
                    to="profile"  
                  >
                    View Profile
                  </Link>  
                  <Link 
                    className='dropdown-item py-1 mb-1'
                    style={{ height: "auto", lineHeight: "20px"}}
                    onClick={handleLogout}
                  >
                    Signout
                  </Link> 
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
