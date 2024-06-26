import React, { useState, useEffect, useRef } from 'react';
import { GrNext, GrPrevious } from "react-icons/gr";
import './Slider.css';

const data = [
    {
        image: "../hinh/1.png",
        name: "Nike D.01",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum facere ipsa blanditiis quidem dignissimos enim quam corrupti praesentium ipsam assumenda?"
    },
    {
        image: "../hinh/2.png",
        name: "Nike D.02",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum facere ipsa blanditiis quidem dignissimos enim quam corrupti praesentium ipsam assumenda?"
    },
    {
        image: "../hinh/3.png",
        name: "Nike D.03",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum facere ipsa blanditiis quidem dignissimos enim quam corrupti praesentium ipsam assumenda?"
    }
];

const Slider = () => {
    const [active, setActive] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const lastPosition = data.length - 1;
    const autoPlayRef = useRef();

    useEffect(() => {
        autoPlayRef.current = nextSlide;
    });

    useEffect(() => {
        const play = () => {
            autoPlayRef.current();
        }
        const interval = setInterval(play, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 600;
            const newOpacity = 1 - scrollY / maxScroll;
            setOpacity(newOpacity < 0 ? 0 : newOpacity);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const nextSlide = () => {
        setActive(active + 1 > lastPosition ? 0 : active + 1);
    }

    const prevSlide = () => {
        setActive(active - 1 < 0 ? lastPosition : active - 1);
    }

    const goToSlide = (index) => {
        setActive(index);
    }

    useEffect(() => {
        document.querySelector('.number').innerText = `0${active + 1}`;
    }, [active]);

    return (
        <div className="slider" style={{ opacity }}>
            <section className="carousel">
                <div className="list">
                    {data.map((item, index) => (
                        <div key={index} className={`item ${active === index ? 'active' : ''}`}>
                            <figure>
                                <img src={item.image} alt={item.name} />
                            </figure>
                            <div className="content">
                                <p className="category">Sport Shoes</p>
                                <h2>{item.name}</h2>
                                <p className="description">{item.desc}</p>
                                <div className="more">
                                    <button>Add To Cart</button>
                                    <button>See More</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="arrows">
                    <button onClick={prevSlide} id="prev"><GrPrevious /></button>
                    <button onClick={nextSlide} id="next"><GrNext /></button>
                </div>
                <div className="indicators">
                    <div className="number">01</div>
                    <ul>
                        {data.map((_, index) => (
                            <li
                                key={index}
                                className={active === index ? 'active' : ''}
                                onClick={() => goToSlide(index)}
                            ></li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default Slider;
