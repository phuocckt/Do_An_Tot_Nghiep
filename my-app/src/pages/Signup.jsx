import { Link, useNavigate } from 'react-router-dom';
import './css/LoginSignup.css'
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { register } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let schema = yup.object().shape({
    firstname: yup.string().required("Firstname is requied"),
    lastname: yup.string().required("Lastname is requied"),
    mobile: yup.string().required("Mobile is requied").matches(/^[0-9]+/,"Input phone number, please!"),
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required'),
  })
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      mobile: '',
      email: '',
      password: ''
    },
    validationSchema: schema, 
    onSubmit: values => {
      dispatch(register(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đăng kí thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/login");
        })
        .catch(() => {
          Swal.fire({
            title: "Đăng kí thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        })
    },
  });

  return (
    <>
        <div className='signup'>
          <div className='signup-container'>
            <h1>Đăng kí</h1>
            <form onSubmit={formik.handleSubmit}>
              
            <input 
              type='text' 
              placeholder='Họ' 
              name='fisrtname'  
              onChange={formik.handleChange("firstname")}  
              value={formik.values.firstname}
            />
                {formik.touched.firstname && formik.errors.firstname ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.firstname}</p>
              ) : null}

            <input 
              type='text' 
              placeholder='Tên' 
              name='lastname'  
              onChange={formik.handleChange("lastname")}  
              value={formik.values.lastname}
            />
                  {formik.touched.lastname && formik.errors.lastname ? (
                  <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.lastname}</p>
                ) : null}

              <input 
                type='text' 
                placeholder='Số điện thoại' 
                name='mobile'  
                onChange={formik.handleChange("mobile")}  
                value={formik.values.mobile}
              />
                {formik.touched.mobile && formik.errors.mobile ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.mobile}</p>
              ) : null}

                <input 
                  type='email' 
                  placeholder='Địa chỉ email' 
                  name='email'  
                  onChange={formik.handleChange("email")}  
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.email}</p>
              ) : null}

                <input 
                  type='password' 
                  placeholder='Nhập password của bạn' 
                  name='password'  
                  onChange={formik.handleChange("password")} 
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.password}</p>
              ) : null}

                {/* <input type='password' placeholder='Enter the Repassword' name='Repassword'  required/> */}
              <button type="submit">Đăng kí</button>
            </form>
            <p>Bạn đã có tài khoản ? <Link to='/login' className='text-danger'>Đăng nhập ngay</Link></p>
          </div>   
        </div>
    </>
  );
}

export default Signup;
