import React, { useState, useEffect } from 'react';
import { Table, Select, Input } from 'antd';
import { deleteProduct, getProducts } from '../features/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';

const { Option } = Select;

const Products = () => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState(null); // Thương hiệu được chọn
  const [searchName, setSearchName] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchSize, setSearchSize] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const productState = useSelector((state) => state.product.products);

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(productId))
          .unwrap()
          .then(() => {
            Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa.', 'success');
            dispatch(getProducts()); // Refresh the product list after deletion
          })
          .catch((error) => {
            Swal.fire('Thất bại!', error.message, 'error');
          });
      }
    });
  };

  const filteredProducts = () => {
    return productState.filter(product => {
      // Kiểm tra tên sản phẩm
      if (searchName && !product.title.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      // Kiểm tra giá
      if (searchPrice && parseFloat(product.price) !== parseFloat(searchPrice)) {
        return false;
      }
      // Kiểm tra loại
      if (searchCategory && product.category.title.toLowerCase() !== searchCategory.toLowerCase()) {
        return false;
      }
      // Kiểm tra kích thước
      if (searchSize && !product.size.some(size => size.title.toLowerCase() === searchSize.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  // Nhóm sản phẩm theo thương hiệu
  const groupedProducts = {};
  productState.forEach(product => {
    if (!groupedProducts[product.brand.title]) {
      groupedProducts[product.brand.title] = [];
    }
    groupedProducts[product.brand.title].push(product);
  });

  let tableData = selectedBrand
    ? groupedProducts[selectedBrand].map((product, index) => ({
      key: index + 1,
      title: product.title,
      description: product.description,
      priceOld: product.priceOld,
      price: product.price,
      category: product.category.title,
      quantity: product.quantity,
      image: product.image,
      color: product.color.map(color => color.title).join(", "),
      size: product.size.map(size => size.title).join(", "),
      action: (
        <>
          <Link to='/' className='ps-3 text-warning'>
            <FiEdit />
          </Link>
          <button
            className='ms-3 ps-3 text-danger btn btn-link'
            onClick={() => handleDelete(product._id)}
          >
            <MdDelete />
          </button>
        </>
      )
    }))
    : filteredProducts().map((product, index) => ({
      key: index + 1,
      title: product.title,
      description: product.description,
      priceOld: product.priceOld,
      price: product.price,
      category: product.category.title,
      quantity: product.quantity,
      image: product.image,
      color: product.color.map(color => color.title).join(", "),
      size: product.size.map(size => size.title).join(", "),
      action: (
        <>
          <Link to='/' className='ps-3 text-warning'>
            <FiEdit />
          </Link>
          <button
            className='ms-3 ps-3 text-danger btn btn-link'
            onClick={() => handleDelete(product._id)}
          >
            <MdDelete />
          </button>
        </>
      )
    }));

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
      title: 'Giá tiền cũ',
      dataIndex: 'priceOld',
      defaultSortOrder: "descend",
      sorter: (a, b) => a.priceOld - b.priceOld
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
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: image => image.map((imageURL, index) => (
        <img key={index} src={imageURL.url} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '5px' }} />
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
    {
      title: 'Hành động',
      dataIndex: 'action'
    }
  ];

  return (
    <div>
      <h3>Sản phẩm</h3>
      <Select
        placeholder="Chọn thương hiệu"
        style={{ width: 200, marginBottom: 20 }}
        onChange={value => setSelectedBrand(value)}
        allowClear
      >
        {Object.keys(groupedProducts).map(brand => (
          <Option key={brand} value={brand}>{brand}</Option>
        ))}
      </Select>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
        style={{ width: 200, marginBottom: 10 }}
      />

      <Input
        placeholder="Tìm kiếm theo giá"
        value={searchPrice}
        onChange={e => setSearchPrice(e.target.value)}
        style={{ width: 200, marginBottom: 10 }}
      />

      <Input
        placeholder="Tìm kiếm theo loại sản phẩm"
        value={searchCategory}
        onChange={e => setSearchCategory(e.target.value)}
        style={{ width: 200, marginBottom: 10 }}
      />

      <Input
        placeholder="Tìm kiếm theo kích thước"
        value={searchSize}
        onChange={e => setSearchSize(e.target.value)}
        style={{ width: 200, marginBottom: 10 }}
      />
      <div>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 1500 }} />
      </div>
    </div>
  )
}

export default Products;
