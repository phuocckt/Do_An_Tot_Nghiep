import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { getCategories } from '../features/category/categorySlice';
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
const Category = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  },[]);
  const categoryState = useSelector((state) => state.category.categories);
  const data = categoryState.map((category, index) => {
    return {
      key: index + 1,
      title: category.title,
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
      <h3>Category</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Category;
