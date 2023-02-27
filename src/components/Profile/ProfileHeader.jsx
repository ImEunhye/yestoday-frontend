import React from 'react'
import Modal from 'react-modal'
import { useState, useEffect } from 'react'
import FollowerModal from '../Modal/FollowerModal'
import FollowingModal from '../Modal/FollowingModal'
import axios from 'axios'
import jwt_decode from 'jwt-decode';

const ProfileHeader = props => {
    const imgSrc = props.user.imageUrl
    const [isFollowingCheck, setIsFollowingCheck] = useState(false);
    const [isFollowerCheck, setIsFollowerCheck] = useState(false);
    const [isFollowed, setisFollowed] = useState(false);

    const token = localStorage.getItem('accessToken')
    const myUserId = jwt_decode(token).sub

    console.log(isFollowed);
    console.log(props.user.id);
    console.log(props + "props 입니다");

    const changeFollowerCheck = () => {
        setIsFollowerCheck(true);
    };

    const changeFollowingCheck = () => {
        setIsFollowingCheck(true);
    };

    const sendFollowGetRequest = async (userId, followUserId) => {
        await axios.post(
            'http://54.248.66.164:8080/follows',
            {
                "user": {
                    "id": userId //Todo 로그인 유저 정보로 업데이트
                },
                "followUser": {
                    "id": followUserId
                }
            }
        )
        setisFollowed(!isFollowed)
        window.location.reload()
    }

    const sendFollowDeleteRequest = async (userId, followUserId) => {
        if (window.confirm(`${props.user.nickname}님을 팔로우 취소하시겠습니까?`)) {
            await axios.delete(
                `http://54.248.66.164:8080/follows/${userId}/${followUserId}`)
            setisFollowed(!isFollowed)
            window.location.reload()
        }
    }

    const checkFollowState = async (userId, followUserId) => {
        console.log("호출됨");
        const response = await axios.get(
            `http://54.248.66.164:8080/follows/following-check/${userId}/${followUserId}`)
        console.log(response.data + "아아아아아아아아아아");
        setisFollowed(response.data)
    }

    useEffect(() => {
        console.log('usee');
        console.log(props.user.id);
        checkFollowState(myUserId, props.user.id);
    }, [props])

    const followButtonController = () => {
        isFollowed ? sendFollowDeleteRequest(myUserId, props.user.id) : sendFollowGetRequest(myUserId, props.user.id);
    }

    console.log(isFollowed + 'asdgasdgsdgdgas');


    return (
        <>
            <div className='flex justify-center w-full mr-7 h-[]155px'>
                <div className='flex mt-8'>
                    <div>
                        <div className='w-36 h-36'>
                            <img className='object-cover w-full h-full rounded-full' src={imgSrc} alt="sasdg" />
                        </div>
                    </div>
                    <section className='w-2/3 ml-14'>
                        <div className='flex'>
                            <h2>
                                <div>{props.user.nickname}</div>
                            </h2>
                            <div className='flex ml-1'>
                                <div className='flex'>
                                    <button className={`flex items-center justify-center w-20 ml-2 rounded-lg ${isFollowed ? 'bg-blue-200' : 'bg-slate-200'}`} onClick={followButtonController}>
                                        <div className='text-[10px] font-bold'>{isFollowed ? '팔로우 취소' : '팔로우'}</div>
                                    </button>
                                    <button className='flex items-center justify-center w-20 ml-2 rounded-lg bg-slate-200'>
                                        <div className='text-[10px] font-bold'>메시지 보내기</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-3'>
                            <ul className='flex w-full'>
                                <li className='w-1/3'>
                                    <div className='flex text-[9px]'>
                                        게시물 <span className='ml-1 font-bold'>{props.postInfo.length}</span>
                                    </div>
                                </li>
                                <li className='w-1/3 ml-2'>
                                    <a href onClick={changeFollowerCheck} className='text-black no-underline'>
                                        <div className='flex text-[9px]'>
                                            팔로워 <span className='ml-1 font-bold'>{props.followerInfo.length}</span>
                                        </div>
                                    </a>
                                </li>
                                <li className='w-1/3 ml-2'>
                                    <a href role="link" onClick={changeFollowingCheck} className='text-black no-underline'>
                                        <div className='flex text-[9px]'>
                                            팔로우 <span className='ml-1 font-bold'>{props.followingInfo.length}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className='flex mt-3'>
                            <span className='text-[9px] font-bold'>
                                {props.user.description}
                            </span>
                        </div>
                    </section>
                </div>
            </div>

            {isFollowerCheck && <FollowerModal setIsFollowerCheck={setIsFollowerCheck} followerInfo={props.followerInfo} user={props.user} />}
            {isFollowingCheck && <FollowingModal setIsFollowingCheck={setIsFollowingCheck} followingInfo={props.followingInfo} user={props.user} />}
        </>
    )
}

export default ProfileHeader