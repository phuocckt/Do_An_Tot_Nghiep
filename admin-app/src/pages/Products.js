import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
import { deleteProduct, getProduct, getProducts, updateProduct } from '../features/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomerInput from '../Components/CustomerInput';
import { getSizes } from '../features/size/sizeSlice';
import ReactQuill from 'react-quill';

const { Option } = Select;

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  const sizeState = useSelector((state) => state.size.sizes);
  const sizes = sizeState.map(i => ({
    _id: i._id,
    size: i.title
  }));

  const showModal = (id) => {
    setEditingProductId(id);
    dispatch(getProduct(id))
      .unwrap()
      .then((product) => {
        setVariants(product.variants);
        formik.setValues({
          description: product.description || '',
          priceOld: product.priceOld || '',
          price: product.price || '',
          variants: product.variants || [],
          quantity: product.quantity || 0,
        });
      });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const schema = yup.object().shape({
    description: yup.string(),
    priceOld: yup.number()
      .typeError('Price must be a number')
      .positive('Price must be a positive number')
      .integer('Price must be an integer'),
    price: yup.number()
      .required('Price is required')
      .typeError('Price must be a number')
      .positive('Price must be a positive number')
      .integer('Price must be an integer'),
    variants: yup.array().of(
      yup.object().shape({
        quantity: yup.number()
          .required('Quantity is required')
          .typeError('Quantity must be a number')
          .positive('Quantity must be a positive number')
          .integer('Quantity must be an integer')
      })
    ).min(1, 'At least one variant is required').required('Variants are required'),
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const { product } = useSelector((state) => state.product);
  const handleAddVariant = () => {
    const newVariants = [...variants, { size: '', quantity: '' }];
    setVariants(newVariants);
    formik.setFieldValue('variants', newVariants);
    updateTotalQuantity(newVariants);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = variants.filter((_, idx) => idx !== index);
    setVariants(updatedVariants);
    formik.setFieldValue('variants', updatedVariants);
    updateTotalQuantity(updatedVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = variants.map((variant, idx) =>
      idx === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
    formik.setFieldValue('variants', updatedVariants);
    updateTotalQuantity(updatedVariants);
  };

  const updateTotalQuantity = (updatedVariants) => {
    const totalQuantity = updatedVariants.reduce((total, variant) => total + Number(variant.quantity || 0), 0);
    formik.setFieldValue('quantity', totalQuantity);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: product.description || '',
      priceOld: product.priceOld || '',
      price: product.price || '',
      variants: product.variants || [],
      quantity: product.quantity || 0
    },
    validationSchema: schema,
    onSubmit: values => {
      const data = { id: editingProductId, productData: values };
      dispatch(updateProduct(data))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getProducts());
          setIsModalOpen(false);
        })
        .catch((error) => {
          Swal.fire({
            title: "Sửa thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    },
  });

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
            dispatch(getProducts());
          })
          .catch((error) => {
            Swal.fire('Thất bại!', error.message, 'error');
          });
      }
    });
  };

  const filteredProducts = () => {
    return productState.filter(product => {
      if (searchName && !product.title.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      if (searchPrice && parseFloat(product.price) !== parseFloat(searchPrice)) {
        return false;
      }
      if (searchCategory && product.category.title.toLowerCase() !== searchCategory.toLowerCase()) {
        return false;
      }
      return true;
    });
  };

  const groupedProducts = {};
  productState.forEach(product => {
    if (!groupedProducts[product.brand.title]) {
      groupedProducts[product.brand.title] = [];
    }
    groupedProducts[product.brand.title].push(product);
  });

  const formatCurrency = (numb) =>
    Number(numb).toLocaleString("vi", {
      style: "currency",
      currency: "vnd",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });

  let tableData = selectedBrand
    ? groupedProducts[selectedBrand].map((product, index) => ({
      key: index + 1,
      title: product.title,
      description: product.description,
      priceOld: product.priceOld == null ? "" : formatCurrency(product.priceOld),
      price: formatCurrency(product.price),
      category: product.category ? product.category.title : '',
      quantity: product.quantity,
      image: product.image,
      variants: product.variants.map(variant => ({
        size: variant.size ? variant.size.title : '',
        quantity: variant.quantity
      })),
      action: (
        <>
          <button
            onClick={() => showModal(product._id)}
            className='ms-3 ps-3 text-warning btn btn-link'
          >
            <FiEdit />
          </button>
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
      priceOld: product.priceOld == null ? "" : formatCurrency(product.priceOld),
      price: formatCurrency(product.price),
      category: product.category ? product.category.title : '',
      quantity: product.quantity,
      image: product.image,
      variants: product.variants.map(variant => ({
        size: variant.size ? variant.size.title : '',
        quantity: variant.quantity
      })),
      action: (
        <>
          <button
            onClick={() => showModal(product._id)}
            className='ms-3 ps-3 text-warning btn btn-link'
          >
            <FiEdit />
          </button>
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
      render: image => image.map((img, index) => (
        <img key={index} src={img.url} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '5px' }} />
      ))
    },
    {
      title: 'Biến thể',
      dataIndex: 'variants',
      render: variants => variants.map((variant, index) => (
        <div key={index}>
          Kích thước: {variant.size}, Số lượng: {variant.quantity}
        </div>
      )),
      width: 300,
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

      <div>
        <Table columns={columns} dataSource={tableData} scroll={{ x: 1500 }} style={{"white-space": "nowrap"}}/>
      </div>
      <Modal
        title="Sửa sản phẩm"
        visible={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={formik.handleSubmit}>
            Lưu
          </Button>,
        ]}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <CustomerInput
                type="number"
                value={formik.values.priceOld}
                label="Giá gốc"
                name="priceOld"
                onChange={formik.handleChange("priceOld")}
              />
              {formik.touched.priceOld && formik.errors.priceOld ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.priceOld}</p>
              ) : null}
            </div>
            <div className="col-md-6 mb-3">
              <CustomerInput
                type="number"
                value={formik.values.price}
                label="Giá khuyến mãi"
                name="price"
                onChange={formik.handleChange("price")}
              />
              {formik.touched.price && formik.errors.price ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.price}</p>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <CustomerInput
                type="number"
                value={formik.values.quantity}
                label="Tổng số lượng"
                name="quantity"
                readOnly
              />
              {formik.touched.quantity && formik.errors.quantity ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.quantity}</p>
              ) : null}
            </div>
            <div className="col-md-6 mb-3">
              <Button type="button" className='btn btn-success' onClick={handleAddVariant}>
                Thêm biến thể
              </Button>
            </div>
          </div>
          {variants.map((variant, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-4">
                <select
                  onChange={(value) => handleVariantChange(index, 'size', value)}
                  className="form-control"
                >
                  <option value="" disabled hidden>Chọn kích thước</option>
                  {sizes.map((size, idx) => (
                    <option key={idx} value={size._id}
                      selected={size.size == variant.size.title}>
                      {size.size}
                    </option>
                  ))}
                </select>
                {console.log(variant, sizes)}
              </div>
              <div className="col-md-4">
                <CustomerInput
                  type="number"
                  value={variant.quantity}
                  label="Số lượng"
                  name={`variants[${index}].quantity`}
                  onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                />
                {/* {formik.touched.variants && formik.errors.variants ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.variants}</p>
              ) : null} */}
              </div>
              <div className="col-md-4">
                <Button type="button" className='btn btn-danger' onClick={() => handleRemoveVariant(index)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
          <div className="row">
            <div className="col-md-12 mb-3">
              <label htmlFor="description">Mô tả</label>
              <ReactQuill
                theme="snow"
                value={formik.values.description}
                name="description"
                onChange={(value) => formik.setFieldValue('description', value)}
              />
              {formik.touched.description && formik.errors.description ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.description}</p>
              ) : null}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
