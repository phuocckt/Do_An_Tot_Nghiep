import "./News.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function News() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const data = [
    {
      id: 1,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      id: 2,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      id: 3,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      id: 4,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      id: 5,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
    {
      id: 6,
      image: "../hinh/bg-nav.png",
      title: "Nike",
      decs: "We offer competitive prices on our 100 million plus product any range.",
    },
  ];

  return (
    <>
      <div className="news">
        <h3 className="mb-5 text-center fw-bold">Thời trang và phong cách</h3>
        <div className="list-news mx-5" data-aos="fade-up" data-aos-delay={`${1 * 100}`}>
          {data.map((item, index) => (
            <div>
              <img src={item.image} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default News;
