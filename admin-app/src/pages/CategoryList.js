import React, { useEffect, useState } from 'react'
import { Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { deleteCategory, getCategories, getCategory, updateCategory } from '../features/category/categorySlice';
import Swal from 'sweetalert2';
import { updateBrand } from '../features/brand/brandSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomerInput from '../Components/CustomerInput';

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
  },
  {
    title: 'Hành động',
    dataIndex: 'action'
  }
];
const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const showModal = (id) => {
    setEditingCategoryId(id);
    dispatch(getCategory(id));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    title: yup.string()
      .required('Không được bỏ trống')
      .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ cái và khoảng trắng')
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const { categoryName } = useSelector((state) => state.category);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: categoryName || ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const data = { id: editingCategoryId, categoryData: values };
      dispatch(updateCategory(data))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getCategories());  // Cập nhật danh sách thương hiệu
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
  const categoryState = useSelector((state) => state.category.categories);
  const data = categoryState.map((category, index) => {
    return {
      key: index + 1,
      title: category.title,
      action: (
        <>
          <button
            onClick={() => showModal(category._id)}
            className='ms-3 ps-3 text-warning btn btn-link'
          >
            <FiEdit />
          </button>
          <button
            className='ms-3 ps-3 text-danger btn btn-link'
            onClick={() => handleDelete(category._id)}
          >
            <MdDelete />
          </button>
        </>
      )
    };
  });
  const handleDelete = (categoryId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa loại sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory(categoryId))
          .unwrap()
          .then(() => {
            Swal.fire('Đã xóa!', 'Loại sản phẩm đã được xóa.', 'success');
            dispatch(getCategories());
          })
          .catch((error) => {
            Swal.fire('Thất bại!', error.message, 'error');
          });
      }
    });
  };
  return (
    <div>
      <h3>Loại sản phẩm</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Sửa loại sản phẩm"
        open={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <CustomerInput
            type="text"
            label="Nhập loại sản phẩm"
            value={formik.values.title}
            name="title"
            onChange={formik.handleChange}
          />
          {formik.touched.title && formik.errors.title ? (
            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.title}</p>
          ) : null}
        </form>
      </Modal>
    </div>
  )
}

export default Category;
