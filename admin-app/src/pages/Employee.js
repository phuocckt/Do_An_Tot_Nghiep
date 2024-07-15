import React, { useEffect, useState } from 'react'
import { Modal, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { getUsers, getUser, updateUser } from '../features/customer/customerSlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomerInput from '../Components/CustomerInput';
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
const Employee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const dispatch = useDispatch();

  const showModal = (id) => {
    setEditingEmployeeId(id);
    dispatch(getUser(id));
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const schema = yup.object().shape({
    firstname: yup.string().required('Không được bỏ trống'),
    lastname: yup.string().required('Không được bỏ trống'),
    email: yup.string().email('Email không hợp lệ').required('Không được bỏ trống'),
    mobile: yup.string().required('Không được bỏ trống'),
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { customer } = useSelector((state) => state.customer);
  const { firstname, lastname, email, mobile } = customer;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: firstname || '',
      lastname: lastname || '',
      email: email || '',
      mobile: mobile || '',
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(updateUser({ _id: editingEmployeeId, ...values }))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Sửa thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(getUsers());  // Cập nhật danh sách nhân viên
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
    if (customer.role !== "user") {
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
      <h3>Nhân viên</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <Modal
        title="Sửa thông tin nhân viên"
        open={isModalOpen}
        onOk={formik.handleSubmit}
        onCancel={handleCancel}
      >
        <form onSubmit={formik.handleSubmit}>
          <CustomerInput
            type="text"
            label="Họ"
            value={formik.values.firstname}
            name="firstname"
            onChange={formik.handleChange}
          />
          {formik.touched.firstname && formik.errors.firstname ? (
            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.firstname}</p>
          ) : null}
          <CustomerInput
            type="text"
            label="Tên"
            value={formik.values.lastname}
            name="lastname"
            onChange={formik.handleChange}
          />
          {formik.touched.lastname && formik.errors.lastname ? (
            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.lastname}</p>
          ) : null}
          <CustomerInput
            type="email"
            label="Email"
            value={formik.values.email}
            name="email"
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email ? (
            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.email}</p>
          ) : null}
          <CustomerInput
            type="text"
            label="Số điện thoại"
            value={formik.values.mobile}
            name="mobile"
            onChange={formik.handleChange}
          />
          {formik.touched.mobile && formik.errors.mobile ? (
            <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.mobile}</p>
          ) : null}
        </form>
      </Modal>
    </div>
  );
};

export default Employee;
