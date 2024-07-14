import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiMail, CiTurnL1 } from "react-icons/ci";
import "../styles/login.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { forgotPassword } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingSend from "../assets/video/loading.gif";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);

  let schema = yup.object().shape({
    email: yup
      .string()
      .required("Vui lòng nhập email.")
      .email("Email không đúng định dạng."),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(forgotPassword(values))
        .unwrap()
        .then(() => {
          toast.success("Vui lòng kiểm tra email để đổi mật khẩu !");
        })
        .catch(() => {
          toast.error("Email chưa được đăng kí !");
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
      <div className="wrapper-log">
        <form onSubmit={formik.handleSubmit}>
          {isLoading ? (
            <img hidden={!isLoading} src={loadingSend} width={"350px"} />
          ) : (
            <>
              <h2>Quên mật khẩu</h2>
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
              <button type="submit" className="btn-log mb-4">
                Gửi
              </button>
              <Link to={"/"} className="back-home">
                <CiTurnL1 className="me-2" />
                Về trang chủ
              </Link>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
