import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CiLock, CiMail, CiTurnL1, CiPhone, CiUser } from "react-icons/ci";
// import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import "../styles/login.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { register } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let schema = yup.object().shape({
    firstname: yup.string().required("Firstname is requied"),
    lastname: yup.string().required("Lastname is requied"),
    mobile: yup
      .string()
      .required("Mobile is requied")
      .matches(/^[0-9]+/, "Input phone number, please!"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email format"),
    password: yup.string().required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(register(values))
        .unwrap()
        .then(() => {
          toast.success("Đăng kí thành công !");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch(() => {
          toast.error("Email đã được đăng kí !");
        });
    },
  });

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
          <h2>Đăng kí</h2>
          <div className="input-box">
            <input
              name="firstname"
              onChange={formik.handleChange("firstname")}
              value={formik.values.firstname}
              type="text"
              placeholder="Họ"
            />
            <CiUser />
            {formik.touched.firstname && formik.errors.firstname ? (
              <span className="text-error">{formik.errors.firstname}</span>
            ) : null}
          </div>

          <div className="input-box">
            <input
              name="lastname"
              onChange={formik.handleChange("lastname")}
              value={formik.values.lastname}
              type="text"
              placeholder="Tên"
            />
            <CiUser />
            {formik.touched.lastname && formik.errors.lastname ? (
              <span className="text-error">{formik.errors.lastname}</span>
            ) : null}
          </div>

          <div className="input-box">
            <input
              name="mobile"
              onChange={formik.handleChange("mobile")}
              value={formik.values.mobile}
              type="text"
              placeholder="Số điện thoại"
            />
            <CiPhone />
            {formik.touched.mobile && formik.errors.mobile ? (
              <span className="text-error">{formik.errors.mobile}</span>
            ) : null}
          </div>

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
              value={formik.values.password}
              type="text"
              placeholder="Mật khẩu"
            />
            <CiLock />
            {formik.touched.password && formik.errors.password ? (
              <span className="text-error">{formik.errors.password}</span>
            ) : null}
          </div>

          <button type="submit" className="btn-log">
            Đăng kí
          </button>
          <div className="link-log">
            <p>
              Bạn đã có tài khoản?<Link to={"/login"}>Đăng nhập ngay</Link>
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
