import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../features/order/orderSlice';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
  },
  {
    title: 'Product',
    dataIndex: 'products',
  },
  {
    title: 'Payment Intent',
    dataIndex: 'paymentIntent',
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'OrderBy',
    dataIndex: 'orderby',
  }
];
const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const orderState = useSelector((state) => state.order.orders);
  const data = orderState.map((order, index) => {
    const productNames = order.products.map(product => product.product.title).join(", ");
    return {
      key: index + 1,
      products: productNames,
      paymentIntent: order.paymentIntent.amount,
      date: new Date(order.createdAt).toLocaleString(),
      orderby: order.orderby.firstname + " " + order.orderby.lastname,
      action: (
        <>
          <Link to='/' className='ps-3 text-warning'>
            <FiEdit />
          </Link>
          <Link to='/' className='ms-3 ps-3 text-danger'>
            <MdDelete />
          </Link>
        </>
      )
    };
  });
  return (
    <div>
      <h3>Orders</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Orders;
