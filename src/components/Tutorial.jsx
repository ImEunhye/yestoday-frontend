import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { Link } from 'react-router-dom'
// src: `${logo}`
function Tutorial() {
  const slides = [
    {
      url:'https://i.imgur.com/v0kq9ZE.png',
    },
    {
      url: 'https://i.imgur.com/QhVuZda.png',
    },
    {
      url: 'https://i.imgur.com/Z5XGsBt.png',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className=' bg-gray-100 max-w-[1000px] h-[700px] w-full m-auto py-16 px-4 relative group'>
      <div className='flex justify-center italic  bold text-5xl mb-12 '>YesToday Manual</div>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className=' flex justify-center  w-[800] h-[400px] rounded-2xl object-cover bg-center bg-cover  duration-500'
      ></div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
           
          </div>
          
        ))}
      </div ><div className='flex justify-center text-lg bold bg-[#002D74] w-full rounded-xl mt-2 text-white p-2 hover:scale-105 duration-300'>
      <button ><Link className='no-underline text-white' to="/home">YesToday 시작하기</Link></button>
    </div></div>
  );
}

export default Tutorial;
