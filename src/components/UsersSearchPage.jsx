import React from 'react';
import SideBar from './SideBar';
import SaveModal from './Modal/SaveModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const UsersSearchPage = props => {
    const [searchKeyword, setKeyword] = useState('');
    const [searchResult, setResult] = useState(['없음']);
    const [saveIsOpen, setSaveIsOpen] = useState(false);
    const [searchSuccess, setSuccess] = useState(true);

    let resultList = '';

    const navigate = useNavigate();
    const navigateTo = (e) => {
        console.log("e.target", e.target);
        console.log("e.target.id", e.target.id);
        navigate("/profile/" + e.target.id, {
            state: { username: e.target.id }
        })

    }


    const pressEnterHandler = (event) => {
        const enteredValue = event.target.value;
        if (event.key === 'Enter') {
            searchHandler();
        }
    }
    const searchHandler = () => {
        getSearchResult();
    }

    const getSearchResult = async () => {
        console.log(searchKeyword);
        const result = await axios.get('http://localhost:8080/users-search/nickname/' + searchKeyword);
        setResult(result.data)
        console.log(result.data);

    }

    if (searchResult[0] === '없음') {
        resultList = <div></div>
    } else if (searchResult.length === 0) {
        resultList = <div className='p-3 font-bold text-slate-400'>검색 결과가 없습니다.</div>
    } else {
        resultList = searchResult.map(result => (
            <li className='flex items-center p-2 border-b-2 h-14' key={result.id} id={result.nickname} onClick={navigateTo}>
                <img className='w-10 h-10 rounded-full cursor-pointer' src={result.imageUrl} alt="" id={result.nickname} />
                <p className='mt-2 ml-3 cursor-pointer' id={result.nickname} > {result.nickname}</p>
            </li>
        ))

    }





    const showModal = () => {
        setSaveIsOpen(true);
    }




    return (
        <div className='flex justify-center'>
            <div className='hidden border-r-2 sm:hidden md:inline md:w-1/3 lg:w-1/4 xl:w-1/6'>
                <SideBar setSaveIsOpen={setSaveIsOpen}></SideBar>
            </div>
            <div className='flex justify-center md:w-2/3 lg:w-3/4 xl:w-5/6 '>
                <div className='w-[500px] h-[650px] mt-5 rounded-xl shadow-md '>
                    <div className='flex w-full h-14'>
                        <input className='w-full h-full p-3 text-xl outline-none placeholder:text-gray-400 placeholder:text-xl'
                            placeholder='닉네임을 입력하세요' type="text"
                            onKeyDown={pressEnterHandler}
                            onChange={(event) => setKeyword(event.target.value)} />
                        <img className='w-10 h-10 p-1 mt-1 hover:cursor-pointer' src="https://yestoday.s3.ap-northeast-2.amazonaws.com/search.png" alt="" onClick={searchHandler} />
                    </div>
                    <ul className='w-full p-1 h-fit'> {resultList}</ul>

                </div>
            </div>


            {saveIsOpen && <SaveModal setSaveIsOpen={setSaveIsOpen} />}

        </div >
    )
}

export default UsersSearchPage