import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';


const region = "ap-northeast-2";
const bucket = 'yestoday';
let imgName = '';
let imgFile = null;


AWS.config.update({
    region: region,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});


const SaveModal = props => {
    // const [userId, setUserId] = useState(0);
    const [todoId, setTodoId] = useState(0);
    const [todoName, setTodoName] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgType, setImgType] = useState('');
    const [description, setDescription] = useState('');
    const [todos, setTodos] = useState([]);
    const userId = 1;

    useEffect(() => {
        const getTodos = async () => {
            const response = await axios.get('http://localhost:8080/api/todo/users/' + userId + '/not-posted-todos');
            setTodos(response.data);
            console.log(response.data);
        }
        getTodos();
    }, [])

    //포스트를 작성 가능한 todo list
    const todoList = todos.map(todo => (
        <option value={todo.id} key={todo.id}>{todo.name}</option>
    ));

    //todo 갱신
    const setTodoIsPosted = async () => {
        await axios.put('http://localhost:8080/api/todo/id/' + todoId + '/post', null,
            { params: { isPosted: true } });
        await axios.put('http://localhost:8080/api/todo/todocomplete', null,
            { params: { id: todoId } });
    }

    // 등록 버튼 클릭
    const saveFeedHandler = () => {
        if (todoId === 0) {
            alert('todo를 선택해 주세요'); return;
        }
        if (imgUrl === '') {
            alert('사진을 올려주세요'); return;
        }
        const currentTime = new Date(Date.now());

        // await Api.put(`user/${ownerData._id}`, {
        //     image: ownerData._id,
        // });

        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: bucket, // 버킷 이름
                Key: imgName,//imgName.replace(/ /g, ''),//ownerData._id + ".png", // 유저 아이디
                Body: imgFile, // 파일 객체
            },
        });

        if (imgType.substring(0, 5) !== 'image') {
            alert('image 형식이 아닙니다.');
            return;
        }

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

        axios.post('/posts', {
            todoId: todoId,
            todoName: todoName,
            userId: userId,
            imageUrl: 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + imgName,
            imageType: imgType,
            // imgFile: iWmgFile,
            content: description,
            postDateTime: currentTime,
            likeNumbers: 0,
            commentNumbers: 0
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        setTodoIsPosted();

        alert('피드 등록 완료!');
        props.setSaveIsOpen(false);
    }

    // 모달창 닫기
    const closeModal = () => {
        if (window.confirm("게시물 등록을 취소하시겠습니까?")) {
            props.setSaveIsOpen(false);
        }
        // props.setSaveIsOpen(false);
    };

    //이미지 파일 업로드
    const imageInput = useRef();
    const onClickImageUpload = () => {
        imageInput.current.click();
    }

    // 이미지 파일 미리보기
    const encodeFileToBase64 = (fileBlob) => {
        setImgType(fileBlob.type);
        imgName = uuidv4();

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
            className='outline-none absolute z-50 p-2 text-center -translate-x-1/2 -translate-y-1/2 bg-white border-2 w-[400px] rounded-2xl h-[650px] top-1/2 left-1/2'>
            <button className='absolute pl-2 pr-2 font-semibold rounded-md bg-slate-200 right-2 top-2' onClick={closeModal}>
                X
            </button>


            <div className='m-2 text-center'>
                <span>todo </span>

                <select className='border-2' name="todo" onChange={(event) => {
                    setTodoId(event.target.value);
                    const index = event.target.selectedIndex
                    setTodoName(event.target[index].text);
                }}>
                    <option value="0" >--todo 선택--</option>
                    {todoList}
                </select>
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
                    <img className='w-4' src="./images/plus.png" alt="" />
                    <span className='ml-1 text-sm'>이미지 다시 선택하기</span>
                </button>
            </div>
            }

            <textarea className='w-full mt-2 mb-2 border-2 h-[70px] text-sm' onChange={(event) => setDescription(event.target.value)}></textarea>

            <button className='absolute p-1 text-white bg-blue-400 rounded-md text-md right-3 bottom-3' onClick={saveFeedHandler}>
                등록
            </button>
        </Modal>
    );
}

export default SaveModal