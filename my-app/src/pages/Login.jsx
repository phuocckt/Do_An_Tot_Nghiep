import { Link, useNavigate } from 'react-router-dom';
import './css/LoginSignup.css'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required'),
  })
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema, 
    onSubmit: values => {
      dispatch(login(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đăng nhập thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/");
        })
        .catch(() => {
          Swal.fire({
            title: "Đăng nhập thất bại!",
            icon: "error",
            confirmButtonText: "OK",
          });
        })
    },
  });
  return (
    <>
        <div className='login'>
          <div className='login-container'>
            <h1>Đăng nhập</h1>
            <form onSubmit={formik.handleSubmit}>
            <input 
              type='email' 
              placeholder='Email' 
              name='email'  
              onChange={formik.handleChange("email")}  
              value={formik.values.email}
            />
                {formik.touched.email && formik.errors.email ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.email}</p>
              ) : null}

                <input 
              type='password' 
              placeholder='Mật khẩu' 
              name='password'  
              onChange={formik.handleChange("password")}  
              value={formik.values.password}
            />
                {formik.touched.password && formik.errors.password ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.password}</p>
              ) : null}

              <button type='submit'>Đăng nhập</button>
            </form>
            <a className='text-primary' href='/forgot-password'>Quên mật khẩu !</a>
            <p>Bạn chưa có tài khoản? <Link to='/register' className='text-danger'>Đăng kí ngay</Link></p>
          </div>   
        </div>
    </>
  );
}

export default Login;
