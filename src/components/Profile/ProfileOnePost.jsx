import React from 'react'
import PostDetailModal from '../Modal/PostDetailModal'
import { useState, useEffect } from 'react'
import axios from 'axios'


const ProfileOnePost = props => {
    const imgSrc = props.imageUrl
    const [modalOpen, setModalOpen] = useState(false);
    const [like, setLike] = useState(false);
    const [likeId, setLikeId] = useState(0);
    const user = props.post.user;
    const userId = 1;

    const showModal = () => {
        setModalOpen(true);
    }



    useEffect(() => {

        const getLike = async () => {
            const response = await axios.get("http://54.248.66.164:8080/likes/users/" + user.id + "/posts/" + props.post.id);
            if (response.data) {
                setLike(true);
                setLikeId(response.data.id);
            } else {
                setLike(false);
            }

        }

        getLike();



    }, [props])

    return (
        <div className='relative w-56 h-56 mt-10 ml-5 group'  >
            <img className='object-cover w-full h-full bg-white group-hover:opacity-30' src={imgSrc} alt="adgasgsadg" />
            <div className="absolute flex justify-center w-full h-full -translate-y-full bg-transparent opacity-30 place-items-center group-hover:bg-opacity-80 group-hover:opacity-80 bg-neutral-600"
                onClick={showModal}>

                <p className="text-xl font-semibold text-transparent shadow-2xl group-hover:text-black via-black w-fit h-fit"> {props.post.todoName}</p>
            </div>
            {modalOpen && <PostDetailModal setModalOpen={setModalOpen} user={props.user} like={like} likeId={likeId} post={props.post} />}
        </div >
    )
}

export default ProfileOnePost