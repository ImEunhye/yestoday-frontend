import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';

const ScrollTodo = styled.ul`
overflow:auto;
height:370px;
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

const CalendarTodoModal = props => {
    const [todos, setTodos] = useState([]);
    const token = localStorage.getItem('accessToken')
    const myUserId = jwt_decode(token).sub

    useEffect(() => {
        const getTodos = async () => {
            const response = await axios.get('http://54.248.66.164:8080/api/todo/users/' + myUserId + "/todo-date/" + props.date);
            setTodos(response.data)
            console.log(response.data);
        }

        getTodos();

    }, [])

    const todoList = todos.map(todo => (
        todo.completeState ?
            <li key={todo.id} className='flex w-full p-2 break-all border-b-2 h-1/12' >
                <img className='w-5 h-5' src="images/checkmark.png" alt="" />
                <span className='line-through text-slate-400 '>{todo.name}</span>
            </li>
            :
            <li key={todo.id} className='flex w-full p-2 break-all border-b-2 h-1/12'>
                <div className='w-5 h-5'></div>
                <span className=''>{todo.name}</span>
            </li>

    ))


    return (
        <Modal
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
            className='font-nanum p-2 absolute -translate-x-11 -translate-y-1/2 bg-white border-2 outline-none w-[300px] h-[500px] rounded-xl top-1/2 left-1/2'
            onRequestClose={() => props.setTodoIsOpen(false)}
            isOpen={true} ariaHideApp={false}>

            <header>
                <div className='flex justify-center h-10 font-bold' >
                    {props.date.substr(0, 4)}년 {props.date.substr(5, 2)}월 {props.date.substr(8, 2)}일의 Todo-List

                </div>

            </header>


            <ScrollTodo className='w-full p-0 mt-3 overflow-auto h-4/5'>
                {todoList}
            </ScrollTodo>



        </Modal>
    )
}

export default CalendarTodoModal