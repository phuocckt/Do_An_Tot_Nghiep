import React, { useEffect } from "react"
import "./style.css"
import { FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const Wrapper = () => {
  const data = [
    {
      cover: <FaShippingFast/>,
      title: "Giao hàng miễn phí",
      decs: "Chúng tôi hỗ trợ giao hàng trên toàn quốc và hoàn toàn miễn phí.",
    },
    {
      cover: <MdOutlinePayment />,
      title: "Thanh toán sau",
      decs: "Khách hàng hoàn toàn có thể thanh toán sau khi kiểm tra hàng.",
    },
    {
      cover: <FaShieldAlt />,
      title: "Dịch vụ bảo hành",
      decs: "Chúng tôi sẽ đổi mới 100% sản phẩm nếu gặp lỗi do cửa hàng.",
    },
    {
      cover: <BiSupport />,
      title: "Hỗ trợ 24/7",
      decs: "Khi gặp vấn đề cần tư vấn hãy liên hệ chúng tôi để được hỗ trợ.",
    },
  ]
  return (
    <>
      <section className='wrapper background'>
        <h3 className="m-5 text-center fw-bold">Dịch vụ</h3>
        <div className='container grid2'>
          {data.map((val, index) => {
            return (
              <div className='product' key={index} >
                <div className='img icon-circle'>
                  <i className="fs-1">{val.cover}</i>
                </div>
                <h5>{val.title}</h5>
                <p>{val.decs}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Wrapper
