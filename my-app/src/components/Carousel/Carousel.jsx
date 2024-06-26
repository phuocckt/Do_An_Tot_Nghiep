import './Carousel.css'
import { useState, useEffect } from 'react';
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";

function Carousel() {
    const slides = [
        {
            url: '../hinh/bg-nav.png'
        },
        {
            url: '../hinh/logo-nike.jpg'
        },
        {
            url: '../hinh/nike-1.png'
        },
    ]

    const [currentIndex, setcurrentIndex] = useState(0);

    const prev = () => {
        setcurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    };
    const next = () => {
        setcurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
    };
    const gotoSlide = (slideIndex) => {
        setcurrentIndex(slideIndex);
    }
    
    useEffect(() => {
        const timer = setTimeout(()=>{
            if(currentIndex===slides.length-1){
                setcurrentIndex(0);
            }else{
                setcurrentIndex(currentIndex+1);
            }
        },5000);
        return ()=>clearTimeout(timer);
    }, [currentIndex]);

  return (
    <>
        <div className='carousel'>
            <div style={{backgroundImage:`url(${slides[currentIndex].url})`}} className='image'></div>

            <div className='next-prev'>
                <div onClick={next} className='nextSlide'>
                    <i class="fa-solid fa-chevron-right"><CiCircleChevRight className='fs-1'/></i>
                </div>
                <div onClick={prev} className='prevSlide'>
                    <i class="fa-solid fa-chevron-left"><CiCircleChevLeft className='fs-1'/></i>
                </div>
            </div>
            
            <div className='dots'>
                {
                    slides.map((slide, slideIndex)=>(
                        <div key={slideIndex} onClick={()=>gotoSlide(slideIndex)} className='dot'></div>
                    ))
                }
            </div>
        </div>
    </>
  );
}

export default Carousel;
