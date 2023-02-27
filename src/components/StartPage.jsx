import React from 'react'
import { Link } from 'react-router-dom'
import SignUp from './SignUp'
import Signin from './Signin'
import img from '../images/logo1.png'

function StartPage() {


    return (
        <>

            <div className='bg-zinc-200 h-screen flex justify-center items-center'>

                <div className='bg-white rounded-lg shadow-lg shadow-black/30 h-96 pl-8 w-[350px] flex flex-col justfy-center '>
                    <div className="text-muted mt-5 "><img src={img} alt="logo" /></div>
                    <div>
                        <button className='bg-sky-400 m-3 h-10 rounded-full hover:bg-red-500 duration-300 w-[100px] '><Link className='no-underline text-black' to="/Signin" element={<Signin />}>로그인</Link></button>
                        <button className='bg-yellow-400 m-3 ml-3 h-10 rounded-full hover:bg-red-500 duration-300 w-[100px]'>  <Link className='no-underline text-black' to="/Signup" element={<SignUp />}>회원가입</Link> </button>

                    </div>

                </div>
            </div>

        </>
    )
}

export default StartPage
