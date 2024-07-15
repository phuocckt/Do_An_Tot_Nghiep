import React, { useEffect, useState } from 'react';
import { Column } from '@ant-design/plots';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/customer/customerSlice';
import { getProducts } from '../features/product/productSlice';
import { getOrders } from '../features/order/orderSlice';

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

  // Lấy tháng và năm hiện tại
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Xử lý khi chọn lọc doanh thu theo năm
  const handleSelectChange = (value, type) => {
    if (type === 'year') {
      setSelectedYear(value);
    }
  };

  // Lọc đơn hàng dựa trên năm đã chọn
  // const filteredOrders = ordersState.filter((order) => {
  //   const orderDate = new Date(order.createdAt);
  //   const orderYear = orderDate.getFullYear().toString();

  //   return orderYear === selectedYear;
  // });

  // Tính tổng số đơn đặt hàng không bao gồm đơn hàng bị hủy
  const totalOrders = ordersState.filter(order => order.orderStatus !== 'Cancelled').length;

  // Tính tổng số đơn hàng đã giao
  const totalDeliveredOrders = ordersState.filter(order => order.orderStatus === 'Delivered').length;

  // Tính tổng doanh thu từ đơn hàng đã giao
  const totalDeliveredRevenue = ordersState
    .filter(order => order.orderStatus === 'Delivered')
    .reduce((total, order) => {
      return total + order.products.reduce((orderTotal, product) => {
        return orderTotal + (product.count * product.product.price);
      }, 0);
    }, 0);

  // Dữ liệu ban đầu với tất cả các tháng và doanh số bán hàng mặc định được đặt thành 0
  const data = [
    { type: 'Tháng 1', sales: 0 },
    { type: 'Tháng 2', sales: 0 },
    { type: 'Tháng 3', sales: 0 },
    { type: 'Tháng 4', sales: 0 },
    { type: 'Tháng 5', sales: 0 },
    { type: 'Tháng 6', sales: 0 },
    { type: 'Tháng 7', sales: 0 },
    { type: 'Tháng 8', sales: 0 },
    { type: 'Tháng 9', sales: 0 },
    { type: 'Tháng 10', sales: 0 },
    { type: 'Tháng 11', sales: 0 },
    { type: 'Tháng 12', sales: 0 },
  ];

  // Tính doanh số cho mỗi tháng từ các đơn hàng được giao trong năm đã chọn
  ordersState
    .filter(order => order.orderStatus === 'Delivered' && new Date(order.createdAt).getFullYear().toString() === selectedYear)
    .forEach((order) => {
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
            <p className='desc'>Tổng khách hàng</p>
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
            <h4 className='mb-0 sub-title'>{totalOrders} hóa đơn</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng số hóa đơn đã giao</p>
            <h4 className='mb-0 sub-title'>{totalDeliveredOrders} hóa đơn</h4>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Tổng doanh thu hóa đơn đã giao</p>
            <h4 className='mb-0 sub-title'>{totalDeliveredRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='mb-4'>Thống kê thu nhập</h3>
        <div className='mb-3'>
          <label>Lọc theo năm:</label>
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
