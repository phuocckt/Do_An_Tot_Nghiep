import React, { useState } from "react";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import "../styles/avatar.css";
import userNone from "../assets/images/user-none.jpg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Avatar = () => {
  const user = useSelector((state) => state.auth.user);
  const [modalShow, setModalShow] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <div className="avatar">
        <h3 className="m-3">Thông tin tài khoản</h3>
        <div onClick={() => setModalShow(true)} className="img-avatar">
          {user !== null ? (
            user.images[0] ? (
              <img src={user.images[0]?.url} alt="avatar" />
            ) : (
              <img src={userNone} alt="avatar" />
            )
          ) : (
            <img src={userNone} alt="avatar" />
          )}
        </div>
        <h5 className="m-3 fw-bold">
          {user?.firstname + " " + user?.lastname}
        </h5>
        <button className="btn bg-danger text-light mb-3">
          <Logout />
        </button>
      </div>

      <Modal
        show={modalShow}
        size="ms"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => setModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Ảnh đại diện
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-auto">
          <div className="modal-img">
            {user !== null ? (
              user.images[0] ? (
                <img src={user.images[0]?.url} alt="avatar" />
              ) : (
                <img src={userNone} alt="avatar" />
              )
            ) : (
              <img src={userNone} alt="avatar" />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {/* <input type="file" name="" id="" /> */}
          {/* <Button onClick={()=>setIsDisabled(false)} hidden={!isDisabled} variant="info">Đổi ảnh đại diện</Button>
          <Button hidden={isDisabled} variant="primary">Lưu ảnh đại diện</Button> */}
          <Button variant="danger" onClick={() => setModalShow(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Avatar;
