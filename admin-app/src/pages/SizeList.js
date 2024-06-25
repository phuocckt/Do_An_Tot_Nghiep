import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSize, getSize, getSizes, updateSize } from '../features/size/sizeSlice';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormik } from 'formik';
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
    sorter: (a, b) => a.title - b.title
  },
  {
    title: 'Hành động',
    dataIndex: 'action'
  }
];

const Sizes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSizeId, setEditingSizeId] = useState(null);
  const dispatch = useDispatch();

  const showModal = (id) => {
    setEditingSizeId(id);
    dispatch(getSize(id));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const schema = yup.object().shape({
    title: yup.string()
      .required('Không được bỏ trống')
      .matches(/^[0-9.]+$/, 'Chỉ được nhập kí tự số và kí tự .')
  });

  useEffect(() => {
    dispatch(getSizes());
  }, [dispatch]);

  const { sizeName } = useSelector(
    (state) => state.size
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: sizeName || ''
    },
    validationSchema: schema,
    onSubmit: values => {
      const data = { id: editingSizeId, sizeData: values };
      dispatch(updateSize(data))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getSizes());
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

  const sizeState = useSelector((state) => state.size.sizes);
  const data = sizeState.map((size, index) => {
    return {
      key: index + 1,
      title: size.title,
      action: (
        <>
          <button
            onClick={() => showModal(size._id)}
            className='ms-3 ps-3 text-warning btn btn-link'
          >
            <FiEdit />
          </button>
          <button
            className='ms-3 ps-3 text-danger btn btn-link'
            onClick={() => handleDelete(size._id)}
          >
            <MdDelete />
          </button>
        </>
      )
    };
  });

  const handleDelete = (sizeId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa kích thước này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Không, hủy!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSize(sizeId))
          .unwrap()
          .then(() => {
            Swal.fire('Đã xóa!', 'Kích thước đã được xóa.', 'success');
            dispatch(getSizes());
          })
          .catch((error) => {
            Swal.fire('Thất bại!', error.message, 'error');
          });
      }
    });
  };

  return (
    <div>
      <h3>Sizes</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Sửa kích thước"
        open={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <CustomerInput
            type="text"
            label="Nhập kích thước"
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

export default Sizes;
