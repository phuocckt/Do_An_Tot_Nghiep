import React, { useEffect } from 'react'
import { Table } from 'antd';
import { getProducts } from '../features/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'title',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.title.length - b.title.length
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Giá tiền',
    dataIndex: 'price',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.price - b.price
  },
  {
    title: 'Loại sản phẩm',
    dataIndex: 'category',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.category.length - b.category.length
  },
  {
    title: 'Thương hiệu',
    dataIndex: 'brand',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.brand.length - b.brand.length
  },
  {
    title: 'Số lượng tồn kho',
    dataIndex: 'quantity'
  },
  {
    title: 'Ảnh',
    dataIndex: 'images',
    render: images => images.map((image, index) => (
      <img key={index} src={image.url} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '5px' }} />
    ))
  },
  {
    title: 'Màu sắc',
    dataIndex: 'color',
  },
  {
    title: 'Kích thước',
    dataIndex: 'size',
  },
  // {
  //   title: 'Số lượng đánh giá',
  //   dataIndex: 'ratings',
  // },
  // {
  //   title: 'Tổng đánh giá',
  //   dataIndex: 'totalrating',
  // },
  {
    title: 'Hành động',
    dataIndex: 'action'
  }
];
const Products = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  },[]);
  const productState = useSelector((state) => state.product.products);
  const data = productState.map((product, index) => {
    // Kết hợp tên màu sắc thành một chuỗi
    const colorNames = product.colors.map(color => color.title).join(", ");
    const sizeNames = product.size.map(size => size.title).join(", ");
    return {
      key: index + 1,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category.title,
      brand: product.brand.title,
      quantity: product.quantity,
      images: product.images,
      color: colorNames,
      size: sizeNames,
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
      <h3>Products</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  )
}

export default Products;
