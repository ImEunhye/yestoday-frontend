import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SideBar from '../SideBar';
import { useState, useRef } from 'react';
import SaveModal from '../Modal/SaveModal';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import axios from 'axios';

const region = "ap-northeast-2";
const bucket = 'yestoday';
let imgName = '';
let imgFile = null;


AWS.config.update({
  region: region,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const EditProfile = () => {
  const [saveIsOpen, setSaveIsOpen] = useState(false);
  const state = useLocation();
  const navigate = useNavigate();
  const imageInput = useRef();
  const [imgType, setImgType] = useState('');
  const user = state.state;
  const [imgUrl, setImgUrl] = useState(user.imageUrl);

  console.log(user.id + "props.user입니다");

  const [profile, setProfile] = useState({
    id: user.id,
    nickname: user.nickname,
    password: user.password,
    name: user.name,
    description: user.description,
    imageUrl: user.imageUrl,
    email: user.email,
    phoneNumber: user.phoneNumber
  });

  const onChangeProfile = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfileHandler = () => {
    console.log('saveProfileHandler 호출됨');
    console.log(imgName);

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
    if (window.confirm('변경사항을 반영하시겠습니까?')) {
      console.log('왔습니다');

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

      // setProfile({
      //   ...profile,
      //   imageUrl: '안녕하세요'
      //   // imageUrl: 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + imgName
      // });

      console.log(profile);

      axios.put('/users', profile)
      navigate(`/profile/${user.nickname}`)
    }
  }

  const saveProfileButtonHandler = () => {
    if (window.confirm('변경사항을 반영하시겠습니까?')) {
      saveProfileHandler();
      navigate(`/profile/${user.nickname}`);
    }
  }


  const onClickImageUpload = () => {
    imageInput.current.click();
    console.log(imageInput);
  }

  const encodeFileToBase64 = (fileBlob) => {
    console.log('encodeFileToBase64 호출됨');
    setImgType(fileBlob.type);
    imgName = uuidv4();

    setProfile((prevState) => {
      return { ...prevState, imageUrl: 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + imgName }
    });

    console.log(imgName + "imgName입니다.");

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
    <div className='flex justify-center'>
      <div className='hidden border-r-2 sm:hidden md:inline md:w-1/3 lg:w-1/4 xl:w-1/6'>
        <SideBar setSaveIsOpen={setSaveIsOpen}></SideBar>
      </div>
      <div className='flex-col justify-center pt-32 md:w-2/3 lg:w-3/4 xl:w-5/6'>
        <div className='flex justify-center'>
          <div>
            <div className='w-44 h-44'>
              <img className='object-cover w-full h-full rounded-full' src={imgUrl} alt="sasdg" />
            </div>
            <div className='flex justify-center h-20 pt-3 w-44'>
              <input className="hidden" type="file" ref={imageInput} onChange={(event) => {
                encodeFileToBase64(event.target.files[0]);

              }} />
              <button className='w-2/3 border-2 h-1/2 text-[8px]' onClick={onClickImageUpload}>
                프로필 이미지 등록
              </button>
            </div>
          </div>
          <section className='w-1/3 ml-16'>
            <div>
              <div>닉네임(yesToday안에서 사용할 이름입니다.)</div>
              <div className='pt-2'>
                <input type="text" className='border-2 border-slate-400-400 w-80' placeholder={user.nickname} name='nickname' onChange={onChangeProfile} />
              </div>
              <div className='pt-4'>비밀번호</div>
              <div className='pt-2'>
                <input type="text" className='border-2 border-slate-400-400 w-80' name='password' onChange={onChangeProfile} />
              </div>
              <div className='pt-4'>이름</div>
              <div className='pt-2'>
                <input type="text" className='border-2 border-slate-400-400 w-80' placeholder={user.name} name='name' onChange={onChangeProfile} />
              </div>
              <div className='pt-4'>E-mail</div>
              <div className='pt-2'>
                <input type="text" className='border-2 border-slate-400-400 w-80' placeholder={user.email} name='email' onChange={onChangeProfile} />
              </div>
              <div className='pt-4'>소개</div>
              <div className='pt-2'>
                <input type="text" className='border-2 border-slate-400-400 w-80' placeholder={user.description} name='description' onChange={onChangeProfile} />
              </div>
            </div>
          </section>
        </div>
        <div className='flex justify-center pt-12'>
          <div>
            <button className='w-24 h-10 mr-3 border-2 rounded-lg bg-slate-200' onClick={() => navigate(`/profile/${user.nickname}`)}>
              취소
            </button>
          </div>
          <div>
            <button className='w-24 h-10 ml-3 bg-blue-300 border-2 rounded-lg' onClick={saveProfileHandler}>
              저장
            </button>
          </div>
        </div>
      </div>

      {saveIsOpen && <SaveModal setSaveIsOpen={setSaveIsOpen} />}
    </div>
  )
}

export default EditProfile