import React, { useEffect } from 'react';
import CustomerInput from '../Components/CustomerInput';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  MDBContainer,
  MDBCol,
  MDBRow
}
  from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required')
  })
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      dispatch(login(values))
    },
  });
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (user != null) {
      Swal.fire({
        title: "Đăng nhập thành công!",
        text: "Chào mừng Admin: "+ user.firstname+" "+user.lastname,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("admin");
    } 
    else if (user == null && isError && !isLoading) {
      Swal.fire({
        title: "Đăng nhập thất bại!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [user, isSuccess, isError, isLoading]);
  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
        </MDBCol>
        <MDBCol col='4' md='6'>
          <h2 className='text-center'>Sign In Admin</h2>
          <div className='error text-center'>
            {message.message === "Rejected" ? "You are not an Admin" : ""}
          </div>
          <form action='' onSubmit={formik.handleSubmit}>
            <CustomerInput className='mb-4' type="text" name="email" label="Email Address" id="email" onChange={formik.handleChange("email")}
              value={formik.values.email} size='lg' />
            {formik.touched.email && formik.errors.email ? (
              <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.email}</p>
            ) : null}
            <CustomerInput className='mb-4' type="password" name="password" label="Password" id="pass" onChange={formik.handleChange("password")}
              value={formik.values.password} size='lg' />
            {formik.touched.password && formik.errors.password ? (
              <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.password}</p>
            ) : null}
            <div className="d-flex justify-content-between mx-4 mb-4">
              <a href="user/forgot-password">Forgot password?</a>
            </div>
            <button className='border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5' style={{ background: 'blue' }} type="submit">LOGIN</button>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default Login;
