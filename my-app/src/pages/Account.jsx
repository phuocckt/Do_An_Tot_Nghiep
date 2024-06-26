import { Link, Outlet } from "react-router-dom";
import "./css/Account.css";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Account() {
  const [infoCurrent, setInfoCurrent] = useState("Thông tin tài khoản");
    
    const info = [
        {
            param: "",
            name: "Thông tin tài khoản"
        },
        {
            param: "/account/products",
            name: "Danh sách yêu thích"
        },
        {
            param: "/",
            name: "Quản lí đơn hàng"
        }
    ];
    const handleClick = (item) =>{
        setInfoCurrent(item);
    }
  return (
    <>
        {/* <h2>Thông tin tài khoản</h2> */}
        <div className="account">
            <div className="account-info">
                <img className="avatar-image" src="../hinh/nike-1.png" alt="avatar" />
                <ul>
                    {
                        info.map((i)=>{
                            return(
                                <Link to={i.param}>
                                    <li onClick={() => handleClick(i.name)}>{i.name}</li>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="account-content">
                <h5 className="title">{infoCurrent}</h5>
                <div><Outlet /></div>
            </div>
        </div>
    </>
  );
}

export default Account;