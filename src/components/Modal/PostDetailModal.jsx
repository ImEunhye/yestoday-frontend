import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import UpdateModal from './UpdateModal';
import ProfileTodoModal from './ProfileTodoModal';
import styled from "styled-components";



const ScrollUl = styled.ul`
overflow:auto;
height:400px;
&::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`;

const PostDetailModal = props => {
    const userId = 1
    // const [like, setLike] = useState(props.like);
    // const [likeId, setLikeId] = useState(props.likeId);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [refresh, setRefresh] = useState(1);
    const [settingIsOpen, setSettingIsOpen] = useState(false);
    const [updateIsOpen, setUpdateIsOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const isMine = (props.user.id === userId) ? true : false;


    const closeModal = () => {
        props.setModalOpen(false);
    };






    const addLike = async () => {
        const response = await axios.post("http://54.248.66.164:8080/likes", {
            "postId": props.post.id,
            "userId": userId
        })

        props.setLike(true);
        props.setLikeId(response.data[0].id);
    }

    const deleteLike = async () => {
        const response = await axios.delete("http://54.248.66.164:8080/likes/" + props.likeId);

        props.setLike(false);
        props.setLikeId(0);
    }

    const likeHandler = () => {
        if (props.like === false) {
            addLike();
        } else {
            deleteLike();
        }
    }

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("http://54.248.66.164:8080/comments/posts/" + props.post.id);

            setComments(response.data);

        }
        getComments();
        console.log(comments);
    }, [refresh])

    const commentDeleteHandler = (comment) => {
        if (comment.userId === userId) {
            if (window.confirm("댓글을 삭제하시겠습니까?")) {
                alert("댓글이 삭제되었습니다.")
            }
        }
    }

    const deleteCommentHandler = (comment) => {
        console.log(comment);
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            axios.delete('http://54.248.66.164:8080/comments/' + comment.id);
            alert('댓글이 삭제되었습니다.')
            setRefresh(refresh => refresh * -1)
        }

    }

    const commentsList = comments.map((comment) => (
        <li className='flex justify-between mb-4 h-fit ' key={comment.id} >
            <div className='flex mr-2 w-17 h-17'>
                <img className='object-cover w-6 h-6 mr-1 rounded-full' src={comment.user.imageUrl}></img>
                <span className='mt-1 text-xs font-semibold'>{comment.user.nickname}</span>
            </div>
            <span className='flex items-center w-2/5 mt-1 text-xs break-all h-fit ' >{comment.commentDesc}</span>
            <span className='mt-1 text-xs text-slate-500'>{comment.commentDateTime.substr(0, 10)}</span>
            <button className={`${comment.userId === userId ? 'visible' : 'invisible'} text-sm text-red-400 cursor-default h-fit `}
                onClick={() => deleteCommentHandler(comment)}>X</button>
        </li >
    ));


    const saveComment = async () => {
        await axios.post('http://54.248.66.164:8080/comments', {
            postId: props.post.id,
            userId: 1,
            commentDesc: commentText,
            commentDateTime: new Date(Date.now())

        })
    }



    const clickHandler = (event) => {
        if (isValid) {
            saveComment();
            alert("댓글 작성 완료");
            setRefresh(refresh => refresh * -1)
        } else {
            alert("댓글 내용을 작성해주세요")
        }
        setCommentText('');
    }

    const deleteFeed = async () => {
        await axios.delete('http://54.248.66.164:8080/posts/' + props.post.id);
        await axios.put('http://54.248.66.164:8080/api/todo/id/' + props.post.todoId + '/post', null, {
            params: { isPosted: false }
        });

    }

    const deleteHandler = () => {
        setSettingIsOpen(false);
        if (window.confirm("게시물을 삭제하시겟습니까?")) {
            deleteFeed();
            alert('게시물이 삭제되었습니다.')
            closeModal();
            setTimeout(() => { window.location.reload(); }, 1000);

        }
    }


    const updateHandler = () => {
        setUpdateIsOpen(true)
        setSettingIsOpen(false);
    }



    return (
        <Modal
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
            className='shadow-lg font-nanum outline-none flex fixed z-auto text-center -translate-x-1/2 -translate-y-1/2 bg-white border-2 w-[800px] rounded-2xl h-[650px] top-1/2 left-1/2'
            isOpen={true} onRequestClose={closeModal} ariaHideApp={false}>
            <div className='w-3/5 p-1 m-1 border-r-2'>
                <div className='flex justify-between h-12 m-2'>
                    <div className='flex w-fit' onClick={() => setIsClicked(true)}>
                        <img className='object-cover w-10 h-10 rounded-full' src={props.user.imageUrl}></img>
                        <div>
                            <span className='mt-2 ml-3 font-semibold text-left'>{props.user.nickname}</span>
                            <div className='ml-3 text-xs text-left text-slate-400'>{props.post.postDateTime.substr(0, 10)}</div>
                        </div>
                    </div>
                    {isClicked && <ProfileTodoModal setIsClicked={setIsClicked} post={props.post} user={props.user} />}

                    {isMine && <img className='w-6 h-6 mt-2 cursor-pointer' src='https://yestoday.s3.ap-northeast-2.amazonaws.com/more.png' onClick={() => setSettingIsOpen(true)}></img>}


                    <Modal
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(255, 255, 255, 0)'
                            }
                        }}
                        className='absolute w-32 h-20 bg-white border-2 outline-none rounded-xl top-20 left-1/2'
                        isOpen={settingIsOpen} onRequestClose={() => setSettingIsOpen(false)} ariaHideApp={false}>
                        <button className='w-full text-sm h-1/2' onClick={updateHandler}>게시물 수정</button>
                        <hr className='m-0'></hr>
                        <button className='w-full text-sm h-1/2' onClick={deleteHandler}>게시물 삭제</button>
                    </Modal>

                </div>
                <div className='relative flex justify-center px-2 overflow-hidden transition-all duration-500 group'>

                    <img className='h-[500px] w-full object-scale-down transition-all duration-500 bg-black'
                        src={props.post.imageUrl} alt=""
                    />
                    <div className='absolute flex p-4 transition-all duration-500 bg-white rounded shadow-md opacity-70 -bottom-52 group-hover:bottom-7 right-2 left-2 dark:bg-slate-900 dark:shadow-gray-700'>
                        <img className='h-5 '
                            src="https://yestoday.s3.ap-northeast-2.amazonaws.com/check-mark-black.png" alt="" />
                        <p className='font-bold break-all'>{props.post.todoName}</p>
                    </div>

                </div>

                {/* <div className='mt-3 ml-2 text-xs text-left text-slate-400'>{props.post.postDateTime.substr(0, 10)}</div> */}

            </div>

            <div className='w-2/5 h-full font-nanum'>
                <div className='flex justify-between w-full h-20 mt-5 text-left'>

                    <span className='w-full h-20 text-left'>{props.post.context}</span>

                    <img className='h-12 m-2 transition duration-300 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 '
                        src={props.like ? "https://yestoday.s3.ap-northeast-2.amazonaws.com/yes.png" : "https://yestoday.s3.ap-northeast-2.amazonaws.com/yes-black.png"} alt="" onClick={likeHandler} />

                </div>
                <p className='p-1 mb-2 font-semibold text-left'>댓글 {comments.length}개</p>
                <ScrollUl className='p-2 overflow-auto ' >
                    {commentsList}
                </ScrollUl>

                <div className='w-full p-2 shadow-md '>
                    <input className='w-5/6 mr-2 outline-none placeholder:font-sm placeholder:text-slate-300'
                        placeholder='댓글 작성하기' type="text" onChange={e => { setCommentText(e.target.value) }}
                        onKeyUp={e => { e.target.value.length > 0 ? setIsValid(true) : setIsValid(false) }}
                        value={commentText} />
                    <button className='p-1 text-sm border-2 rounded-lg bg-slate-300' onClick={clickHandler}>등록</button>
                </div>

            </div>
            {updateIsOpen && <UpdateModal setRefresh={props.setRefresh} setModalOpen={props.setModalOpen} setUpdateIsOpen={setUpdateIsOpen} post={props.post} user={props.user} ></UpdateModal>}


        </Modal>
    )
}

export default PostDetailModal