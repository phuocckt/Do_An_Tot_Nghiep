import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CiLock, CiMail, CiTurnL1 } from "react-icons/ci";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import "../styles/login.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { login } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);

  let schema = yup.object().shape({
    email: yup
      .string()
      .required("Email không được trống")
      .email("Email không đúng định dạng"),
    password: yup.string().required("Mật khẩu không được trống"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values))
        .unwrap()
        .then(() => {
          toast.success("Đăng nhập thành công !");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        })
        .catch(() => {
          toast.error("Email hoặc Mật khẩu không chính xác !");
        });
    },
  });

//   const hanldeFocus = () => {
//     setEye(!eye);
//   };

  const handleClick = () => {

  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="wrapper">
        <form onSubmit={formik.handleSubmit}>
          <h2>Đăng nhập</h2>
          <div className="input-box">
            <input
              name="email"
              onChange={formik.handleChange("email")}
              value={formik.values.email}
              type="text"
              placeholder="Email"
            />
            <CiMail />
            {formik.touched.email && formik.errors.email ? (
              <span className="text-error">{formik.errors.email}</span>
            ) : null}
          </div>

          <div className="input-box">
            <input
              name="password"
              onChange={formik.handleChange("password")}
              onFocus={()=>{setEye(!eye)}}
              value={formik.values.password}
              type="password"
              placeholder="Mật khẩu"
            />
            {eye? <PiEyeSlashThin onClick={handleClick()}/>:<CiLock/>}
            {/* <CiLock /> */}
            {formik.touched.password && formik.errors.password ? (
              <span className="text-error">{formik.errors.password}</span>
            ) : null}
          </div>
          <div className="forgot-pass">
            <Link to={"/"}>Quên mật khẩu ?</Link>
          </div>
          <button type="submit" className="btn-log">
            Đăng nhập
          </button>
          <div className="link-log">
            <p>
              Bạn chưa có tài khoản?<Link to={"/register"}>Đăng kí ngay</Link>
            </p>
          </div>
          <Link to={"/"} className="back-home">
            <CiTurnL1 className="me-2" />
            Về trang chủ
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
