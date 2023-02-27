import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const SideBar = props => {
    const [user, setUser] = useState([]);
    const token = localStorage.getItem('accessToken')
    const userId = jwt_decode(token).sub
    const navigate = useNavigate();

    const toProfile = (e) => {
        console.log("e.target", e.target);
        console.log("e.target.id", e.target.id);
        navigate("/profile/" + e.target.id, {
            state: { username: e.target.id }
        })

    }

    const toHome = () => {
        navigate('/home', { state: userId });
    }

    const toUsersSearch = () => {
        navigate('/users-search', { state: userId });
    }

    const toCalendar = () => {
        navigate('/calendar', { state: userId });
    }

    const showModal = () => {
        props.setSaveIsOpen(true);
    }

    useEffect(() => {
        axios.get("http://54.248.66.164:8080/users/byid/" + userId)
            .then(response => response.data)
            .then(data => {
                console.log(data);
                setUser(data);
            });
    }, [])



    return (
        <div className='fixed flex flex-col items-center h-screen border-r-2 md:w-1/3 lg:w-1/4 xl:w-1/6 font-nanum '>
            <img className='w-32 mt-3 hover:cursor-pointer' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/logo.png' alt="" onClick={toHome} />


            <div className='p-2 mt-16 bg-opacity-50 w-44 h-28 bg-slate-200 rounded-xl'>
                <div className='flex items-center mt-4 cursor-pointer' onClick={toProfile}>
                    <img className='object-cover w-10 h-10 mr-2 bg-white rounded-full'
                        src={user.imageUrl} alt="" id={user.nickname} />
                    <div>
                        <span className='mt-2 ml-1 font-semibold text-left' id={user.nickname}>{user.nickname}</span>
                        <div className='ml-1 text-xs text-left text-slate-400' id={user.nickname}>{user.email}</div>
                    </div>
                    {/* <span className='text-sm font-semibold' id={user.nickname} >{user.nickname}</span> */}
                </div>
                {/* <span className='text-xs'>{user.email}</span> */}

            </div>

            <ul className='mt-16 text-center'>
                <li className='flex items-center w-40 mb-4 font-semibold text-slate-700 hover:cursor-pointer' onClick={toHome}>
                    <img className='mr-3 w-7 h-7' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/home2.png' alt="" />
                    홈</li>
                <li className='flex items-center w-40 mb-4 font-semibold text-slate-700 hover:cursor-pointer' onClick={toUsersSearch}>
                    <img className='mr-3 w-7 h-7' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/search2.png' alt="" />
                    검색</li>
                <li className='flex items-center w-40 mb-4 font-semibold text-slate-700 hover:cursor-pointer' onClick={toCalendar}>
                    <img className='mr-3 w-7 h-7' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/calendar2.png' alt="" />
                    캘린더</li>
                {/* <li className='flex items-center w-40 font-semibold transition duration-200 text-slate-700 hover:cursor-pointer font-nanum' onClick={showModal}>
                    <img className='mr-3 w-7 h-7 ' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/plus3.png' alt="" />
                </li> */}

            </ul>




        </div>

    )
}

export default SideBar