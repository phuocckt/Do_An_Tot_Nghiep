import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import "./Brand.css";
import { SiNike, SiAdidas, SiJordan, SiPuma, SiFila } from "react-icons/si";

const Brand = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const data = [
    {
      cover: <SiNike />,
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <SiAdidas />,
      title: "Adidas",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <SiJordan />,
      title: "Jordan ",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <SiPuma />,
      title: "Puma ",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      cover: <SiFila />,
      title: "Fila ",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
  ];

  return (
    <>
      <div>
        <h3 className="mb-4">Các nhãn hiệu hàng đầu thế giới:</h3>
        <div className="brand-list">
          {data.map((val, index) => {
            return (
              <div
                className="brand-item"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
                key={index}
              >
                <p>{val.cover}</p>
                <div className="content">{val.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Brand;
