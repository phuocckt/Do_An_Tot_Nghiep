import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBrand, getBrand, getBrands, updateBrand } from '../features/brand/brandSlice';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import CustomerInput from '../Components/CustomerInput';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

const Brand = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const dispatch = useDispatch();

  const showModal = (id) => {
    setEditingBrandId(id);
    dispatch(getBrand(id));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const schema = yup.object().shape({
    title: yup.string()
      .required('Không được bỏ trống')
      .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, 'Chỉ được nhập chữ cái và khoảng trắng')
  });

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  const { brandName } = useSelector((state) => state.brand);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: brandName || ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const data = { id: editingBrandId, brandData: values };
      dispatch(updateBrand(data))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getBrands());  // Cập nhật danh sách thương hiệu
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

  const brandState = useSelector((state) => state.brand.brands);
  const data = brandState.map((brand, index) => {
    return {
      key: index + 1,
      title: brand.title,
      action: (
        <>
          <button
            onClick={() => showModal(brand._id)}
            className='ms-3 ps-3 text-warning btn btn-link'
          >
            <FiEdit />
          </button>
          <button
            className='ms-3 ps-3 text-danger btn btn-link'
            onClick={() => handleDelete(brand._id)}
          >
            <MdDelete />
          </button>
        </>
      )
    };
  });

  const handleDelete = (brandId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBrand(brandId))
          .unwrap()
          .then(() => {
            Swal.fire('Đã xóa!', 'Thương hiệu đã được xóa.', 'success');
            dispatch(getBrands());
          })
          .catch((error) => {
            Swal.fire('Thất bại!', error.message, 'error');
          });
      }
    });
  };

  return (
    <div>
      <h3>Brands</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Sửa thương hiệu"
        open={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <CustomerInput
            type="text"
            label="Nhập tên thương hiệu"
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
  );
};

export default Brand;