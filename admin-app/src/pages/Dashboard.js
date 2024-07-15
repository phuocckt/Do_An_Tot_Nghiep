import React, { useEffect, useState } from 'react';
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go';
import { Column } from '@ant-design/plots';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/customer/customerSlice';
import { getProducts } from '../features/product/productSlice';
import { getOrders } from '../features/order/orderSlice';

const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Product',
    dataIndex: 'product',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
    dispatch(getProducts());
    dispatch(getOrders());
  }, [dispatch]);

  const customerState = useSelector((state) => state.customer.customers);
  const productsState = useSelector((state) => state.product.products);
  const ordersState = useSelector((state) => state.order.orders);

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString(); // January is 0!
  const currentYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Function to handle changes in select boxes
  const handleSelectChange = (value, type) => {
    if (type === 'month') {
      setSelectedMonth(value);
    } else if (type === 'year') {
      setSelectedYear(value);
    }
  };

  // Logic to calculate and filter data based on selected date
  const filteredOrders = ordersState.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const orderMonth = (orderDate.getMonth() + 1).toString();
    const orderYear = orderDate.getFullYear().toString();

    return orderMonth === selectedMonth && orderYear === selectedYear;
  });

  // Initial data with all months and sales set to 0
  const data = [
    { type: 'January', sales: 0 },
    { type: 'February', sales: 0 },
    { type: 'March', sales: 0 },
    { type: 'April', sales: 0 },
    { type: 'May', sales: 0 },
    { type: 'June', sales: 0 },
    { type: 'July', sales: 0 },
    { type: 'August', sales: 0 },
    { type: 'September', sales: 0 },
    { type: 'October', sales: 0 },
    { type: 'November', sales: 0 },
    { type: 'December', sales: 0 },
  ];

  // Calculate sales for each month from filtered orders
  filteredOrders.forEach((order) => {
    const monthIndex = new Date(order.createdAt).getMonth();
    data[monthIndex].sales += order.products.reduce((total, product) => {
      return total + (product.count * product.product.price);
    }, 0);
  });

  const config = {
    data: data,
    xField: 'type',
    yField: 'sales',
    color: ({ type }) => '#ffd333',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Month',
      },
      sales: {
        alias: 'Income',
      },
    },
  };

  return (
    <div>
      <h3 className='mb-4'>Thống kê</h3>
      <div className='d-flex justify-content-between align-items-center gap-3'>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng hạch hàng</p>
            <h4 className='mb-0 sub-title'>{customerState.length} người dùng</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng sản phẩm</p>
            <h4 className='mb-0 sub-title'>{productsState.length} sản phẩm</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng số hóa đơn</p>
            <h4 className='mb-0 sub-title'>{ordersState.length} hóa đơn</h4>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='mb-4'>Thống kê thu nhập</h3>
        <div className='mb-3'>
          <select
            value={selectedMonth}
            onChange={(e) => handleSelectChange(e.target.value, 'month')}
          >
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => handleSelectChange(e.target.value, 'year')}
          >
            {[...Array(new Date().getFullYear() - 2019)].map((_, index) => (
              <option key={2020 + index} value={2020 + index}>
                {2020 + index}
              </option>
            ))}
          </select>
        </div>
        <Column {...config} />
      </div>
    </div>
  );
};

export default Dashboard;
