import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { getBrands } from "../../features/brand/brandSlice";
import { useDispatch, useSelector } from "react-redux";

import "./Brand.css";
import { SiNike, SiAdidas, SiJordan, SiPuma, SiFila } from "react-icons/si";
const getBrandIcon = (title) => {
  switch (title) {
    case "Nike":
      return <SiNike />;
    case "Adidas":
      return <SiAdidas />;
    case "Jordan":
      return <SiJordan />;
    case "Puma":
      return <SiPuma />;
    case "Fila":
      return <SiFila />;
    default:
      return null;
  }
};

const Brand = () => {
  const dispatch = useDispatch();
  const brandState = useSelector((state) => state.brand.brands);

  useEffect(() => {
    dispatch(getBrands());
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <div>
        <h3 className="mb-5 text-center fw-bold">Các nhãn hiệu hàng đầu thế giới</h3>
        <div className="brand-list">
        {brandState.map((brand, index) => (
          <div
            className="brand-item"
            data-aos="fade-up"
            data-aos-delay={`${index * 100}`}
            key={index}
          >
            <p>{getBrandIcon(brand.title)}</p>
            <div className="content">{brand.title}</div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
};

export default Brand;
