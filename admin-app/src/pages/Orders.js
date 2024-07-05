import React, { useEffect, useState } from 'react';
import { Table, Modal, Select, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, updateOrderStatus } from '../features/order/orderSlice';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import Swal from 'sweetalert2';

const { Option } = Select;

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
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
    title: 'Trạng thái đơn hàng',
    dataIndex: 'orderStatus'
  },
  {
    title: 'Sửa trạng thái',
    dataIndex: 'action'
  }
];

const Orders = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.order.orders);

  const showModal = (order) => {
    setCurrentOrder(order);
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

  const renderStatusOptions = (orderStatus) => {
    const options = [
      { value: 'Shipping', label: 'Shipping' },
      { value: 'Cancelled', label: 'Cancelled' },
      { value: 'Delivered', label: 'Delivered' }
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

  const data = orderState.map((order, index) => {
    const productNames = order.products.map(product => product.product.title).join(", ");
    return {
      key: index + 1,
      products: productNames,
      address: order.orderby.address,
      mobile: order.orderby.mobile,
      orderby: `${order.orderby.firstname} ${order.orderby.lastname}`,
      orderStatus: order.orderStatus,
      action: (
        <Button onClick={() => showModal(order)} disabled={order.orderStatus === 'Cancelled'}>
          <FiEdit />
        </Button>
      )
    };
  });

  return (
    <div>
      <h3>Đơn hàng của khách</h3>
      <Table columns={columns} dataSource={data} />
      <Modal title="Update Order Status" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Select style={{ width: '100%' }} onChange={handleChange} value={newStatus}>
          {currentOrder && renderStatusOptions(currentOrder.orderStatus).map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

export default Orders;
