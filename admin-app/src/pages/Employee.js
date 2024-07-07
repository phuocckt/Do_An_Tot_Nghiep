import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../features/customer/customerSlice';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Mobile',
    dataIndex: 'mobile',
  },
  {
    title: 'Role',
    dataIndex: 'role'
  }
];
const Employee = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  },[]);
  const customerState = useSelector((state) => state.customer.customers);
  const data = [];
for (let i = 0; i < customerState.length; i++) {
  if (customerState[i].role !== "user") {
    data.push({
      name: customerState[i].firstname + " " + customerState[i].lastname,
      email: customerState[i].email,
      mobile: customerState[i].mobile,
      role: customerState[i].role
    });
  }
}
  return (
    <div>
      <h3>Nhân viên</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Employee;
