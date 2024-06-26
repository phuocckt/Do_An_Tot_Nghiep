import React from "react"
import "./style.css"
import { FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

const Wrapper = () => {
  const data = [
    {
      cover: <FaShippingFast/>,
      title: "Worldwide Delivery",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <MdOutlinePayment />,
      title: "Safe Payment",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <FaShieldAlt />,
      title: "Shop With Confidence ",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <BiSupport />,
      title: "24/7 Support ",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
  ]
  return (
    <>
      <section className='wrapper background'>
        <div className='container grid2'>
          {data.map((val, index) => {
            return (
              <div className='product' key={index}>
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
