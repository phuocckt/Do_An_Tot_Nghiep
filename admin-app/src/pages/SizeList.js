import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getSizes } from '../features/size/sizeSlice';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'title',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.title - b.title
  }
];
const Sizes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSizes());
  },[]);
  const sizeState = useSelector((state) => state.size.sizes);
  const data = sizeState.map((size, index) => {
    return {
      key: index + 1,
      title: size.title,
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
      <h3>Sizes</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Sizes;
