import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(getCart(userId));
  // }, []);


  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <>
      <span onClick={handleLogout}>
        Đăng xuất
      </span>
      
    </>
  );
};

export default Logout;
