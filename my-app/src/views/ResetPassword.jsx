import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CiLock, CiTurnL1 } from "react-icons/ci";
import { PiEyeSlashThin, PiEyeThin } from "react-icons/pi";
import "../styles/login.css";
import { useFormik } from "formik";
import * as yup from "yup";
import {resetPassword } from "../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tokenPass = useParams();
  let schema = yup.object().shape({
    password: yup.string().required('Vui lòng nhật mật khẩu.'),
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
          toast.success("Cập nhật mật khẩu thành công !");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch(() => {
          toast.error("Cập nhật mật khẩu thất bại !");
        })
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
          <h2>Đổi mật khẩu</h2>
          <div className="input-box">
            <input
              name="password"
              onChange={formik.handleChange("password")}
              value={formik.values.password}
              type="password"
              placeholder="Nhập mật khẩu mới"
            />
            {/* {eye? <PiEyeSlashThin onClick={handleClick()}/>:<CiLock/>} */}
            <CiLock />
            {formik.touched.password && formik.errors.password ? (
              <span className="text-error">{formik.errors.password}</span>
            ) : null}
          </div>
          <button type="submit" className="btn-log">
            Cập nhật
          </button>
          <Link to={"/"} className="back-home mt-4">
            <CiTurnL1 className="me-2" />
            Về trang chủ
          </Link>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
