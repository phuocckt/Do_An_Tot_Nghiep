import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/loginSignup.css'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../features/auth/authSlice';
import Swal from 'sweetalert2';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenPass = useParams();
  let schema = yup.object().shape({
    password: yup.string().required('Password is required'),
  })
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: schema, 
    onSubmit: values => {
        console.log(values);
        const data = { token: tokenPass.token, password: values };
      dispatch(resetPassword(data))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Đổi mật khẩu thành công!",
            icon: "success",
            confirmButtonText: "OK",
          });
          navigate("/login");
        })
        .catch(() => {
          Swal.fire({
            title: "Đổi mật khẩu không thành công!",
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
            <h1>Đổi mật khẩu</h1>
            <form onSubmit={formik.handleSubmit}>
            <input 
              type='password' 
              placeholder='Password' 
              name='password'  
              onChange={formik.handleChange("password")}  
              value={formik.values.password}
            />
                {formik.touched.password && formik.errors.password ? (
                <p style={{ color: "red", fontSize: "13px" }}>{formik.errors.password}</p>
              ) : null}

              <button type='submit'>Thay đổi</button>
            </form>
          </div>   
        </div>
    </>
  );
}

export default Login;
