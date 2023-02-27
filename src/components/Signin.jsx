import { React, useEffect, useState } from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { Link } from 'react-router-dom'
import SignUp from '../components/SignUp';
import { KAKAO_AUTH_URL } from './Kakao/OAuth';
// import GoogleLog from './Kakao/GoogleLog'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../images/login.png'

function Signin() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState(0)
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordOption, setPasswordOption] = useState(false);
    const [saveIDFlag, setSaveIDFlag] = useState(false);
    const [term, setTerm] = useState(false);
    const [capsLockFlag, setCapsLockFlag] = useState(false);
    const LS_KEY_ID = "LS_KEY_ID";
    const LS_KEY_SAVE_ID_FLAG = "LS_KEY_SAVE_ID_FLAG";
    const navigate = useNavigate();
    
    useEffect(() => {
        const idFlag = JSON.parse(localStorage.getItem(LS_KEY_SAVE_ID_FLAG));
        if (idFlag !== null) setSaveIDFlag(idFlag);
        if (idFlag === false) localStorage.setItem(LS_KEY_ID, "");
        let data = localStorage.getItem(LS_KEY_ID);
        if (data !== null) setEmail(data);
    }, []);
    const handleSaveIDFlag = () => {
        localStorage.setItem(LS_KEY_SAVE_ID_FLAG, !saveIDFlag);
        setSaveIDFlag(!saveIDFlag);
    };
    //capslock 감지
    const checkCapsLock = (e) => {
        const capsLock = e.getModifierState("CapsLock");
        setCapsLockFlag(capsLock);
    };
    // password input에서 type과 autoComplete를 변경
    const [passwordInputType, setPasswordInputType] = useState({
        type: "password",
        autoComplete: "current-password",
    });
    //passwordOption이 변경될 때마다 setPasswordInputType으로 type과 autoComplete을 변경
    useEffect(() => {
        if (passwordOption === false)
            setPasswordInputType({
                type: "password",
                autoComplete: "current-password",
            });
        else
            setPasswordInputType({
                type: "text",
                autoComplete: "off"
            });
    }, [passwordOption]);
    //비밀번호 유효성 검사
    const onChangePassword = (e) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if ((!e.target.value || (passwordRegex.test(e.target.value)))) setPasswordError(false);
        else setPasswordError(true);
        setPassword(e.target.value);
    };
    //이메일 유효성검사
    const onChangeEmail = (e) => {
        const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (!e.target.value || emailRegex.test(e.target.value)) setEmailError(false);
        else setEmailError(true);
        setEmail(e.target.value);
    };
    //이메일 비밀번호 유효성 검증
    const validation = () => {
        if (!password) setPasswordError(true);
        if (!email) setEmailError(true);
        if (password && email) return true;
        else return false;
    };
    const getUserIdBeforeLogin = async (e) => {
        e.preventDefault();
        if (validation()) {
            try {
                console.log("호출됨");
                const response = await axios.get('http://54.248.66.164:8080' + `/users/byemail/${email}`)
                const userId = response.data.id
             
                await axios.post(
                    'http://54.248.66.164:8080/auth/login',
                    {
                        email: email,
                        password: password,
                    }
                ).then((res) => {
                    //200(OK), 201(Created)
                    console.log('로그인 완료');
                    alert('로그인에 성공했습니다.')
                    //로그인 성공시 id저장
                    localStorage.setItem(LS_KEY_ID, email)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    // 로그인 성공시 메인화면이동
                    navigate('/', { state: userId })
                })
                    .catch((err) => {
                        //500(err)
                        console.error(err);
                        alert('로그인에 실패했습니다.')
                    });
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            alert('로그인에 실패했습니다.')
        }
    }
    //유효성 검증 후 로그인 api 호출
    const onSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            getUserIdBeforeLogin();
            console.log(userId + "asdfasgdasdgsagsgd");
            axios({
                method: 'post',
                url: 'http://54.248.66.164:8080/auth/login',
                data: {
                    email: email,
                    password: password,
                },
            })
                .then((res) => {
                    //200(OK), 201(Created)
                    console.log('로그인 완료');
                    alert('로그인에 성공했습니다.')
                    //로그인 성공시 id저장
                    localStorage.setItem(LS_KEY_ID, email)
                    localStorage.setItem('accessToken', res.data.accessToken)
                    // 로그인 성공시 메인화면이동
                    window.location.replace('/tutorial')
                })
                .catch((err) => {
                    //500(err)
                    console.error(err);
                    alert('로그인에 실패했습니다.')
                });
            if (!validation()) {
                alert('로그인에 실패했습니다.')
            }
        };
    };
    return (
        <>
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                {/* Form */}
                <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p- items-center">
                    <form className="md:w-1/2 p-4 md:p-8" action="">
                        <div>
                            <p className="font-bold text-2xl text-[#002D74]">로그인</p>
                        </div>
                        <div className='mr-5'>

                            <p className='text-zinc-600 pt-3 font-semibold'>아이디</p>
                            <input className="p-2 rounded-xl border w-full"
                                type="text"
                                value={email}
                                onChange={onChangeEmail}
                                onKeyDown={(e) => checkCapsLock(e)}
                                placeholder='Email@.com' required />
                        </div>
                        <div className="errorMessageWrap">
                            {emailError &&
                                <div>올바른 이메일 주소를 입력해주세요.</div>
                            }
                        </div>

                        <div className='mr-5'>
                            <p className='text-zinc-600 mt-3 font-semibold'>비밀번호</p>
                            <input className="p-2 rounded-xl border w-full"
                                type={passwordInputType.type}
                                value={password}
                                onChange={onChangePassword}
                                autoComplete={passwordInputType.autoComplete}
                                onKeyDown={(e) => checkCapsLock(e)}
                                placeholder='Password'
                                required />
                        </div>
                        <div className="errorMessageWrap">
                            {passwordError && (
                                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                            )}

                        </div>


                        <div className=' align-middle mb-1 space-y-2 mt-1 text-sm '>
                            <input
                                type="checkbox"
                                name="saveEmail"
                                id="saveEmail"
                                checked={saveIDFlag}
                                onChange={handleSaveIDFlag}
                            />
                            <label className=' mt-4'>
                                <span className='text-ml ml-1 mr-3'>아이디 저장</span>
                            </label>

                            <span
                                className={
                                    capsLockFlag ? "caps-lock caps-lock-on" : "caps-lock"
                                }
                            >
                                {capsLockFlag ? "Caps Lock On" : "Caps Lock Off"}
                            </span>
                        </div>
                        <div className=' flex justify-center ' >
                            <button className="bg-[#002D74] w-full rounded-xl mt-4 text-white p-2 hover:scale-105 duration-300" onClick={onSubmit} >로그인</button>

                        </div>
                        <div class="mb-2 mt-4 grid grid-cols-3 items-center text-gray-400">
                            <hr class="border-gray-400" />
                            <p class="text-center text-sm">OR</p>
                            <hr class="border-gray-400 mb" />
                        </div>
                        {/* <div className='flex flex-row justify-center gap-10 text-3xl rounded-xl'>

                            < GoogleLog />

                        </div> */}
                        {/* <div className='border-b border-[#002D74]'>
                            <button className="mt-2 text-xs  py-4 text-[#002D74]">비밀번호 찾기 </button>
                        </div> */}
                        <div>
                            <p className="mt-2 text-xs flex justify-between items-center text-[#002D74]">아이디가 없으시다면? <span className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"><Link className='text-black no-underline' to="/Signup" element={<SignUp />}>회원가입</Link></span></p>
                        </div>
                    </form>
                    <div className="md:block hidden w-1/2">
                        <div class="text-muted p-10 contain"><img src={img} alt="logo" /></div>
                    </div>
                    </div>
            </div>
        </>
    )
}
export default Signin