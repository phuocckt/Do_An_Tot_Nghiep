import React from 'react'
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import { Column } from '@ant-design/plots';
import { Table } from 'antd';
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
const data1 = [];
for (let i = 1; i < 46; i++) {
  data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: "Jogger",
    status: `Delivering`,
  });
}

const Dashboard = () => {
  const data = [
    {
      type: 'January',
      sales: 38,
    },
    {
      type: 'February',
      sales: 52,
    },
    {
      type: 'March',
      sales: 61,
    },
    {
      type: 'April',
      sales: 145,
    },
    {
      type: 'May',
      sales: 48,
    },
    {
      type: 'Jun',
      sales: 38,
    },
    {
      type: 'July',
      sales: 35,
    },
    {
      type: 'August',
      sales: 67,
    },
    {
      type: 'September',
      sales: 72,
    },
    {
      type: 'October',
      sales: 34,
    },
    {
      type: 'November',
      sales: 82,
    },
    {
      type: 'December',
      sales: 65,
    },
  ];
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    color: ({ type }) => {
      return "#ffd333";
    },
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
  }
  return (
    <div>
      <h3 className='mb-4'>Dashboard</h3>
      <div className='d-flex justify-content-between align-items-center gap-3'>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Total</p>
            <h4 className='mb-0 sub-title'>$1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='green'><GoArrowUpRight />36%</h6>
            <p className='mb-0 desc'>Compared to April 2022</p>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Total</p>
            <h4 className='mb-0 sub-title'>$1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='red'><GoArrowDownRight />36%</h6>
            <p className='mb-0 desc'>Compared to April 2022</p>
          </div>
        </div>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3'>
          <div>
            <p className='desc'>Total</p>
            <h4 className='mb-0 sub-title'>$1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='red'><GoArrowDownRight />36%</h6>
            <p className='mb-0 desc'>Compared to April 2022</p>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <h3 className='mb-4'>Income Statics</h3>
      </div>
      <div>
        <Column {...config} />
      </div>
      <div className='mt-4'>
        <h3 className='mb-4'>Recent Orders</h3>
          <div><Table columns={columns} dataSource={data1} /></div>
      </div>
    </div>
  )
}

export default Dashboard;