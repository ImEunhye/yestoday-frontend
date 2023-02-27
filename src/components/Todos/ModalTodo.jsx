import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';



const baseUrl = 'http://54.248.66.164:8080/api/todo'




const MyButton = props => {

    const [show, setShow] = useState(false);
    const [todoDescription, setTodoDescription] = useState(props.todoDescription);
    const [showDescription, setShowDescription] = useState(props.todoDescription);
    const [todoName, setTodoName] = useState(props.todo);
    const [showName, setShowName] = useState(props.todo);
    useEffect(() => {
        setTodoName(props.todo);
    }, [])

    const handleClose = () => {
        setShowDescription(todoDescription);
        setShowName(todoName);
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const updateTodoHandler = () => {
        console.log(props.id);
        console.log(showDescription);

        axios.put(baseUrl, {
            id: props.id,
            name: showName,
            todoDescription: showDescription
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);

            });
        setShow(false);


    }

    return (
        <div>
            {/* <button className="ml-2 font-extrabold cursor-default text-slate-200 hover:text-[#D70D8B]"  onClick={handleShow}>+</button> */}
            <img className='w-5 h-5 mr-4 transition duration-300 ease-in-out delay-100 cursor-pointer hover:-translate-y-1 hover:scale-110' src="https://yestoday.s3.ap-northeast-2.amazonaws.com/pencil.png" alt="" onClick={handleShow}/>
            

            <Modal show={show} onHide={handleClose} className=" right-6">
                <div className="mx-3 mb-3 ">
                    <label className="block mt-3 mb-2 font-sans text-3xl text-center font-outline-1 text-[#69E0E8] shadow-black" >
                       Todo
                    </label>
                    <input
                        maxLength={20}
                        className="w-full px-3 py-2 leading-tight text-black border-[2px] border-black rounded appearance-none focus:outline-none focus:shadow-outline"
                        onChange={(event) => setShowName(event.target.value)} value={showName}  ></input>
                    <label className="block mt-3 mb-2 font-sans text-2xl text-center text-white font-outline-1" >
                        Description
                    </label>
                    <textarea className="w-full px-3 py-2 leading-tight text-black border-[2px] border-black rounded appearance-none h-60 focus:outline-none focus:shadow-outline"
                        onChange={(event) => setShowDescription(event.target.value)} value={(showDescription==null?"":showDescription)} >{showDescription}</textarea>
                </div>
                <div className="flex items-center justify-end w-full mb-3">
                    <button type='button' className="px-4 py-2 mr-3  font-sans text-white text-lg font-outline-1 bg-[#FBCB0A] border-b-4 border-[#fbcb0ae6] rounded hover:bg-[#D70D8B] hover:border-[#d70d8a90]"  onClick={updateTodoHandler}>
                        SAVE
                    </button>
                    <button className="px-4 py-2 mr-3 font-sans text-white font-outline-1 text-lg bg-[#FBCB0A] border-b-4 border-[#fbcb0ae6] rounded hover:bg-[#D70D8B] hover:border-[#d70d8a90]"  onClick={handleClose}>
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    )
}
export default MyButton;