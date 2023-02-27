import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';

const ModalOneUser = props => {
  const [isFollowed, setFollowed] = useState(false);
  const imgSrc = '/images/french-bulldog-gd966262cf_1920.jpg'
  console.log(props.id);


  useEffect(() => {
    axios.get(
      `http://54.248.66.164:8080/follows/following-check/${props.user.id}/${props.id}`)
      .then(response => response.data)
      .then(data => setFollowed(data))


  }, [])


  return (
    <>
      <div className='flex items-center'>
        <a href={props.nickname} className='flex items-center w-full h-full text-black no-underline'>
          <div className='w-12 h-12 overflow-hidden'>
            <img className='object-cover w-full h-full rounded-full' src={props.imageUrl} alt="sasdg" />
          </div>
          <div className='flex w-1/2 ml-6'>
            {props.nickname}
          </div>
        </a>
        {/* <button className={`items-center justify-center w-20 rounded-lg ${isFollowed ? 'bg-blue-200' : 'bg-slate-200'} h-7`}>
          <div className='text-[10px] font-bold '>{isFollowed ? '팔로우 취소' : '팔로우'}</div>
        </button> */}
      </div>
      <hr className='mr-6' />
    </>
  )
}

export default ModalOneUser