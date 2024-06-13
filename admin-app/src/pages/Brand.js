import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../features/brand/brandSlice';
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
    sorter: (a, b) => a.title.length - b.title.length
  }
];
const Brand = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBrands());
  },[]);
  const brandState = useSelector((state) => state.brand.brands);
  const data = brandState.map((brand, index) => {
    return {
      key: index + 1,
      title: brand.title,
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
      <h3>Brands</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Brand;
