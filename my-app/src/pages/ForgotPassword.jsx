import { Link, useNavigate } from 'react-router-dom';
import './css/LoginSignup.css'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email format'),
  })
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: schema, 
    onSubmit: values => {
      dispatch(forgotPassword(values))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Gửi thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/login");
        })
        .catch(() => {
          Swal.fire({
            title: "Email không tồn tại!",
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
            <h1>Forgot Password</h1>
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

              <button type='submit'>Send</button>
            </form>
          </div>   
        </div>
    </>
  );
}

export default Login;
