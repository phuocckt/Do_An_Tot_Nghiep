import React, { useEffect, useState } from 'react';
import { Modal, Table, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { getUsers, getUser, updateUser } from '../features/customer/customerSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
const columns = [
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    defaultSortOrder: "descend",
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'mobile',
  },
  {
    title: 'Vai trò',
    dataIndex: 'role'
  },
  {
    title: 'Hành động',
    dataIndex: 'action'
  }
];
const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const dispatch = useDispatch();

  const showModal = (id) => {
    setEditingCustomerId(id);
    dispatch(getUser(id));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const schema = yup.object().shape({
    role: yup.string().required('Không được bỏ trống')
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { customer } = useSelector((state) => state.customer);
  const { role } = customer;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role: role || ''
    },
    validationSchema: schema,
    onSubmit: values => {
      console.log(values);
      dispatch(updateUser({ _id: editingCustomerId, role: values.role }))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getUsers());  // Cập nhật danh sách khách hàng
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

  const customerState = useSelector((state) => state.customer.customers);
  const data = customerState.map((customer, index) => {
    if (customer.role !== "admin") {
      return {
        key: index + 1,
        name: customer.firstname + " " + customer.lastname,
        email: customer.email,
        mobile: customer.mobile,
        role: customer.role,
        action: (
          <>
            <button
              onClick={() => showModal(customer._id)}
              className='ms-3 ps-3 text-warning btn btn-link'
            >
              <FiEdit />
            </button>
          </>
        ),
      };
    }
    return null;
  }).filter(item => item !== null);

  return (
    <div>
      <h3>Khách hàng</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Sửa vai trò khách hàng"
        open={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Vai trò</label>
            <Select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={(value) => formik.setFieldValue('role', value)}
              style={{ width: '100%' }}
            >
              <Select.Option value="user">user</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
            {formik.touched.role && formik.errors.role ? (
              <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.role}</p>
            ) : null}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
