import React, { useState, useEffect } from 'react'
import axios from 'axios';
import PostDetailModal from '../Modal/PostDetailModal';
import TodoModal from '../Modal/TodoModal';
// import { Link } from 'react-router-dom';

const baseUrl = 'http://localhost:8080/users'

const Post = props => {
    console.log(props);
    // const feedDate = props.feedDate.substr(0, 10);

    const [user, setUser] = useState([]);
    const [like, setLike] = useState(false);
    const [isClicked, setIsClicked] = useState(false);


    const [modalOpen, setModalOpen] = useState(false);
    const showModal = () => {
        setModalOpen(true);
    }

    useEffect(() => {
        const getUser = async () => {
            // if (props.feed.length === 0) {
            //     console.log("feed 1");
            //     console.log(props.feed[0]);
            //     // const response = await axios.get(baseUrl + '/' + props.feed[0].userId)
            // }
            console.log(props.feed);
            const response = await axios.get(baseUrl + '/' + props.feed.userId)

            setUser(response.data);
        }

        getUser();

    }, [])

    const likeHandler = () => {
        setLike(!like);
    }

    return (
        <div className='h-[570px] p-2 m-5 border-2 w-96 rounded-2xl'>
            <header className='flex justify-between w-full pb-2 pl-1 '>
                <div className='flex' onClick={() => setIsClicked(true)} >
                    <img className='w-1/3 mr-3'
                        src={user.profileImg} alt="" />
                    <span className='flex items-center text-sm'>{user.nickname}</span>

                </div>
                {isClicked && <TodoModal setIsClicked={setIsClicked} user={user} />}

                {/* <span className='text-xs text-slate-500 '>{feedDate}</span> */}
            </header>
            <div className='flex justify-center h-80 bg-slate-100'>
                <img className='object-scale-down'
                    src={props.feed.imgUrl} alt="" />

            </div>
            <div className='flex justify-between'>
                <div className='flex mt-2 text-left h-fit'>
                    <img className='h-5'
                        src="https://yestoday.s3.ap-northeast-2.amazonaws.com/check-mark-black.png" alt="" />
                    <p className='text-lg font-bold'>
                        {props.feed.todoName}
                    </p>
                </div>
                <div className='h-8 mt-2 mb-1'>
                    <img className='h-full transition duration-300 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 '
                        src={like ? "images/yes.png" : "images/yes-black.png"} alt="" onClick={likeHandler} />
                </div>

            </div>

            <p className='h-20 text-sm text-left '>{props.feed.feedDescription}</p>
            {/* <Link to={`/${props.feedID}`}> */}
            <p className='h-10 text-sm text-left text-slate-500 line' onClick={showModal}>댓글 모두보기</p>
            {modalOpen && <PostDetailModal setModalOpen={setModalOpen} user={user} like={like} feed={props.feed} />}
            {/* </Link> */}
        </div>

    )
}

export default Post