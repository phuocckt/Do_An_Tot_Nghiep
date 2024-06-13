import React, { useEffect } from 'react'
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getColors } from '../features/color/colorSlice';
const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'title',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.title.length - b.title.length
  }
];
const Colors = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getColors());
  },[]);
  const colorState = useSelector((state) => state.color.colors);
  const data = colorState.map((color, index) => {
    return {
      key: index + 1,
      title: color.title,
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
      <h3>Colors</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Colors;
