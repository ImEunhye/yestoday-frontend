import React, { useState, useEffect } from 'react'
import axios from 'axios';
import PostDetailModal from '../Modal/PostDetailModal';
import ProfileTodoModal from '../Modal/ProfileTodoModal';
import jwt_decode from 'jwt-decode';
// import { Link } from 'react-router-dom';


const baseUrl = 'http://54.248.66.164:8080/users'

const Post = props => {
    // const feedDate = props.feedDate.substr(0, 10);
    // const [user, setUser] = useState();
    const [like, setLike] = useState(false);
    const [likeId, setLikeId] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    const user = props.post.user;
    const token = localStorage.getItem('accessToken')
    const userId = jwt_decode(token).sub

    const [modalOpen, setModalOpen] = useState(false);
    const showModal = () => {
        setModalOpen(true);
    }

    useEffect(() => {

        const getLike = async () => {

            const response = await axios.get("http://54.248.66.164:8080/likes/users/" + userId + "/posts/" + props.post.id);
            if (response.data) {
                setLike(true);
                setLikeId(response.data.id);
            } else {
                setLike(false);
            }

        }

        getLike();



    }, [])

    const addLike = async () => {
        const response = await axios.post("http://54.248.66.164:8080/likes", {
            "postId": props.post.id,
            "userId": userId
        })
        setLike(true);
        setLikeId(response.data[0].id);
    }

    const deleteLike = async () => {
        const response = await axios.delete("http://54.248.66.164:8080/likes/" + likeId);
        setLike(false);
        setLikeId(0);
    }

    const likeHandler = () => {
        if (like === false) {
            addLike();
        } else {
            deleteLike();
        }
    }


    return (
        <div className='bg-white h-[730px] p-2 m-5 border-2 w-[470px] rounded-2xl shadow-md'>
            <header className='flex justify-between w-full pb-2 pl-1 m-1 '>
                <div className='flex cursor-pointer' onClick={() => setIsClicked(true)} >
                    <img className='object-cover w-10 h-10 mr-3 rounded-full'
                        src={user.imageUrl} alt="" />
                    <div>
                        <span className='mt-2 ml-1 font-semibold text-left'>{user.nickname}</span>
                        <div className='ml-1 text-xs text-left text-slate-400'>{props.post.postDateTime.substr(0, 10)}</div>
                    </div>
                    {/* <span className='flex items-center font-semibold text-md'>{user.nickname}</span> */}

                </div>
                {isClicked && <ProfileTodoModal setIsClicked={setIsClicked} user={user} />}

                {/* <span className='text-xs text-slate-500 '>{feedDate}</span> */}
            </header>
            <div className='relative flex justify-center w-full overflow-hidden transition-all duration-500 h-[450px] group '>

                <img className='object-scale-down w-[430px] h-[450px] transition-all duration-500 bg-black'
                    src={props.post.imageUrl} alt=""
                />
                <div className='absolute flex p-4 transition-all duration-500 bg-white rounded shadow-md opacity-70 -bottom-52 group-hover:bottom-4 right-2 left-2 dark:bg-slate-900 dark:shadow-gray-700'
                >
                    <img className='h-5 '
                        src="https://yestoday.s3.ap-northeast-2.amazonaws.com/check-mark-black.png" alt="" />
                    <p className='font-bold break-all'>{props.post.todoName}</p>
                </div>

            </div>
            <div className='flex justify-end '>
                <div className='h-10 mt-3 mb-1 mr-3'>
                    <img className='h-full transition duration-300 ease-in-out delay-150 cursor-pointer hover:-translate-y-1 hover:scale-110 '
                        src={like ? "https://yestoday.s3.ap-northeast-2.amazonaws.com/yes.png" : "https://yestoday.s3.ap-northeast-2.amazonaws.com/yes-black.png"} alt="" onClick={likeHandler} />
                </div>

            </div>

            <p className='h-20 pl-2 text-sm text-left break-all'>{props.post.content}</p>
            <p className='h-10 pl-2 text-sm font-semibold text-left cursor-pointer text-slate-400' onClick={showModal}>댓글 보기...</p>
            {modalOpen && <PostDetailModal setModalOpen={setModalOpen}
                user={user} like={like} likeId={likeId} post={props.post}
                setLike={setLike} setLikeId={setLikeId} />}

        </div>

    )
}

export default Post