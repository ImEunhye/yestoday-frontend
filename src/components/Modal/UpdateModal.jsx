import React, { useEffect, useState } from 'react'

import { useRef } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import Modal from 'react-modal'


const baseUrl = 'http://54.248.66.164:8080/posts'
const region = "ap-northeast-2";
const bucket = 'yestoday';
let imgName = '';
let imgFile = null;

AWS.config.update({
    region: region,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});


const UpdateModal = props => {

    const [imgUrl, setImgUrl] = useState('');
    const [imgType, setImgType] = useState('');
    const [description, setDescription] = useState('');
    const [imageIsUpdate, setImageIsUpdate] = useState(false);



    useEffect(() => {
        setImgUrl(props.post.imageUrl);
        setDescription(props.post.content);
        setImgType(props.post.imageType);
        imgName = props.post.imageUrl.split('.com/')[1];

    }, [])

    // 등록 버튼 클릭
    const updateFeedHandler = () => {
        if (imgUrl === '') {
            alert('사진을 올려주세요'); return;
        }


        if (imageIsUpdate) {
            const upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: bucket, // 버킷 이름
                    Key: imgName.replace(/ /g, ''),//ownerData._id + ".png", // 유저 아이디
                    Body: imgFile, // 파일 객체
                },
            });


            const promise = upload.promise();
            promise.then(
                function () {
                    console.log('이미지 업로드 성공');
                },
                function (err) {
                    console.log(err);
                    console.log('이미지 업로드 실패');
                    // 이미지 업로드 실패
                }
            );
        }


        axios.put(baseUrl, {
            id: props.post.id,
            todoId: props.post.todoId,
            todoName: props.post.todoName,
            userId: props.post.userId,
            imageUrl: 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + imgName.replace(/ /g, ''),
            imageType: imgType,
            // imageFile: imgFile,
            content: description,
            postDateTime: props.post.postDateTime,
            likeNumbers: props.post.likeNumbers,
            commentNumbers: props.post.commentNumbers,

        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);

            });

        alert('피드 수정 완료!');
        props.setUpdateIsOpen(false);
        props.setModalOpen(false);
        setTimeout(() => { window.location.reload(); }, 1000);

    }

    // 모달창 닫기
    const closeModal = () => {
        if (window.confirm('게시물 수정을 취소하시겠습니까?')) {
            props.setUpdateIsOpen(false);
        }

    };

    //이미지 파일 업로드
    const imageInput = useRef();
    const onClickImageUpload = () => {
        imageInput.current.click();
    }

    // 이미지 파일 미리보기
    const encodeFileToBase64 = (fileBlob) => {
        setImageIsUpdate(true);
        setImgType(fileBlob.type);
        imgName = fileBlob.name;

        imgFile = fileBlob;
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);

        return new Promise((resolve) => {
            reader.onload = () => {
                setImgUrl(reader.result);
                resolve();
            };
        });
    };


    return (
        <Modal
            style={{
                overlay: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }
            }}
            onRequestClose={closeModal}
            isOpen={true} ariaHideApp={false}
            className='font-nanum outline-none absolute z-50 p-2 text-center -translate-x-1/2 -translate-y-1/2 bg-white border-2 w-[400px] rounded-2xl h-[650px] top-1/2 left-1/2'>
            <button className='absolute pl-2 pr-2 font-semibold rounded-md bg-slate-200 right-2 top-2' onClick={closeModal}>
                X
            </button>

            {/*  <select onChange={handleSelect} value={Selected}>
                    {selectList.map((item) => (
                        <option value={item} key={item}>
                        {item}
                        </option>
                    ))}
                    </select> */}
            <div className='flex m-2 text-center h-fit'>
                <img className='h-4'
                    src="https://yestoday.s3.ap-northeast-2.amazonaws.com/check-mark-black.png" alt="" />
                <p className='text-lg font-bold'>
                    {props.post.todoName}
                </p>
            </div>


            <div className='flex justify-center w-full border-2 h-[400px]'>
                <input className="hidden" type="file" ref={imageInput} onChange={(event) => {
                    encodeFileToBase64(event.target.files[0]);

                }} />
                {!imgUrl && <button onClick={onClickImageUpload}><img className='w-20 h-20' src="/images/plus.png" alt="" /></button>}
                {imgUrl && <img className='object-scale-down h-full' src={imgUrl} alt="preview-img" />}

            </div>

            {imgUrl && <div className='flex justify-center mt-2'>
                <button className='flex pl-2 pr-2 border-2 rounded-lg bg-slate-200' onClick={onClickImageUpload}>
                    <img className='w-4' src="/images/plus.png" alt="" />
                    <span className='ml-1 text-sm'>이미지 다시 선택하기</span>
                </button>
            </div>
            }

            <textarea className='w-full mt-2 mb-2 border-2 h-[70px] text-sm' onChange={(event) => setDescription(event.target.value)} value={description}></textarea>

            <button className='absolute p-1 text-white bg-blue-400 rounded-md text-md right-3 bottom-3' onClick={updateFeedHandler}>
                수정 완료
            </button>
        </Modal>
    );
}

export default UpdateModal