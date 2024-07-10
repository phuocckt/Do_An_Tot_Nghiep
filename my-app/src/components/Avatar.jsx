import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import '../styles/avatar.css'

const Avatar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <>
      <div className="account-info">
        <h3 className="mb-3">Thông tin tài khoản</h3>
        {/* {user?.images.length > 0 ? (
          <img
            src={user.images[0]?.url}
            alt="no_image"
            className="rounded-circle"
            fluid
          />
        ) : ( */}
          <img
            src="../hinh/user-none.jpg"
            alt="no_image"
            className="rounded-circle"
            fluid
          />
        {/* )} */}
        {/* <h3>{user?.firstname + " " + user?.lastname}</h3> */}
        <button className="bg-danger">
          <Logout />
        </button>
      </div>
    </>
  );
};

export default Avatar;
