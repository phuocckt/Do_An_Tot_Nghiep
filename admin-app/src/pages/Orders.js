import React, { useEffect, useState } from 'react';
import { Table, Modal, Select, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, updateOrderStatus } from '../features/order/orderSlice';
import { FiEdit } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { CiExport } from "react-icons/ci";
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';

const { Option } = Select;

const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: '_id',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'products',
  },
  {
    title: 'Địa chỉ khách hàng',
    dataIndex: 'address',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'mobile',
  },
  {
    title: 'Người đặt',
    dataIndex: 'orderby',
  },
  {
    title: 'Ngày và giờ đặt',
    dataIndex: 'createdAt',
  },
  {
    title: 'Ngày và giờ sửa',
    dataIndex: 'updatedAt',
  },
  {
    title: 'Trạng thái đơn hàng',
    dataIndex: 'orderStatus'
  },
  {
    title: 'Sửa trạng thái',
    dataIndex: 'action'
  }
];

// Hàm để chuyển đổi trạng thái đơn hàng từ tiếng Anh sang tiếng Việt
const getStatusInVietnamese = (status) => {
  switch (status) {
    case 'Pending':
      return 'Đang xử lí';
    case 'Cancelled':
      return 'Đã hủy';
    case 'Delivered':
      return 'Đã giao xong';
    case 'Shipping':
      return 'Đang giao hàng';
    default:
      return status;
  }
};

const Orders = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.order.orders);

  const showModal = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.orderStatus);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOrder(null);
    setNewStatus('');
  };

  const handleOk = () => {
    dispatch(updateOrderStatus({ id: currentOrder._id, orderData: { status: newStatus } }))
      .unwrap()
      .then(() => {
        Swal.fire({
          title: "Cập nhật thành công!",
          icon: "success",
          confirmButtonText: "OK",
        });
        dispatch(getOrders());
      })
      .catch((error) => {
        Swal.fire({
          title: "Cập nhật thất bại!",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
    handleCancel();
  };

  const handleChange = (value) => {
    setNewStatus(value);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  const renderStatusOptions = (orderStatus) => {
    const options = [
      { value: 'Shipping', label: 'Đang giao đơn hàng' },
      { value: 'Cancelled', label: 'Hủy đơn hàng' },
      { value: 'Delivered', label: 'Đã giao đơn hàng' }
    ];

    if (orderStatus === 'Shipping') {
      return options.filter(opt => opt.value !== 'Cancelled' && opt.value !== 'Shipping' && opt.value !== 'Pending');
    }

    if (orderStatus === 'Unpaid' || orderStatus === 'Pending') {
      return options.filter(opt => opt.value !== 'Delivered');
    }

    if (orderStatus === 'Delivered') {
      return options.filter(opt => opt.value !== 'Cancelled' && opt.value !== 'Shipping' && opt.value !== 'Pending' && opt.value !== 'Delivered');
    }

    return options;
  };

  const filteredOrders = orderState
    .filter(order => filterStatus === 'All' || order.orderStatus === filterStatus)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const data = filteredOrders.map((order, index) => {
    const productNames = order.products.map(product => product.product.title).join(", ");
    return {
      _id: "#" + order._id,
      products: productNames,
      address: order.orderby.address,
      mobile: order.orderby.mobile,
      orderby: `${order.orderby.firstname} ${order.orderby.lastname}`,
      createdAt: format(new Date(order.createdAt), 'HH:mm dd/MM/yyyy'),
      updatedAt: format(new Date(order.updatedAt), 'HH:mm dd/MM/yyyy'),
      orderStatus: getStatusInVietnamese(order.orderStatus), // Hiển thị trạng thái bằng tiếng Việt
      action: (
        <Button onClick={() => showModal(order)} disabled={order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}>
          <FiEdit />
        </Button>
      )
    };
  });

  const dataExport = filteredOrders.map((order, index) => {
    const productNames = order.products.map(product => product.product.title).join(", ");
    return {
      'Mã đơn hàng': "#" + order._id,
      'Tên sản phẩm': productNames,
      'Địa chỉ': order.orderby.address,
      'Số điện thoại': `${'Tel: '}${order.orderby.mobile}`,
      'Người đặt': `${order.orderby.firstname} ${order.orderby.lastname}`,
      'Ngày và giờ đặt': format(new Date(order.createdAt), 'HH:mm dd/MM/yyyy'),
      'Ngày và giờ sửa': format(new Date(order.updatedAt), 'HH:mm dd/MM/yyyy'),
      'Trạng thái đơn hàng': order.orderStatus, // Dữ liệu gốc vẫn giữ nguyên bằng tiếng Anh
    };
  });

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h3>Đơn hàng của khách</h3>
        <div className='d-flex align-items-center'>
          <Select defaultValue="All" style={{ width: 120, marginRight: 10 }} onChange={handleFilterChange}>
            <Option value="All">Tất cả</Option>
            <Option value="Pending">Đang xử lí</Option>
            <Option value="Shipping">Đang giao</Option>
            <Option value="Delivered">Đã giao</Option>
            <Option value="Cancelled">Đã hủy</Option>
          </Select>
          <CSVLink
            data={dataExport} 
            separator={","}
            filename={"order.csv"}
            className="btn btn-warning d-flex align-items-center"
          >
            <CiExport className='me-1'/> Export
          </CSVLink>
        </div>
      </div>
      
      <Table columns={columns} dataSource={data} style={{"white-space": "nowrap"}} />
      <Modal title="Cập nhật trang thái đơn hàng" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Select style={{ width: '100%' }} onChange={handleChange} value={getStatusInVietnamese(newStatus)}>
          {currentOrder && renderStatusOptions(currentOrder.orderStatus).map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

export default Orders;
