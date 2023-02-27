import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const ProfileTodoModal = props => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();
    const navigateTo = (e) => {
        console.log("e.target", e.target);
        console.log("e.target.id", e.target.id);
        navigate("/profile/" + e.target.id, {
            state: { username: e.target.id }
        })

    }

    const dateFormat = (date) => {
        const dateFormatted = date.getFullYear() + '-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))
            + '-' + ((date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate()));
        return dateFormatted;
    }

    useEffect(() => {
        const getTodos = async () => {
            const response = await axios.get('http://54.248.66.164:8080/api/todo/users/' + props.user.id + "/todo-date/" + dateFormat(new Date()));
            setTodos(response.data)
            console.log(response.data);
        }

        getTodos();

    }, [])

    const todoList = todos.map(todo => (
        todo.completeState ?
            <li key={todo.id} className='flex w-full p-2 break-all border-b-2 h-1/12 '>
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
            className='font-nanum p-2 absolute -translate-x-1/2 -translate-y-1/2 bg-white border-2 outline-none w-[300px] h-[500px] rounded-xl top-1/2 left-1/2'
            onRequestClose={() => props.setIsClicked(false)}
            isOpen={true} ariaHideApp={false}>

            <header>
                <div className='flex h-10' >
                    <img className='object-cover w-10 h-10 mr-2 rounded-full'
                        src={props.user.imageUrl} alt="" />
                    <span className='flex items-center text-sm'>{props.user.nickname} 님의</span>
                    <span className='flex items-center ml-2 font-bold '>  Today Todo-List</span>

                </div>

            </header>


            <ScrollTodo className='w-full p-0 mt-3 overflow-auto h-4/5'>
                {todoList}
            </ScrollTodo>

            <div className='p-1 m-2 font-bold text-center transition duration-200 rounded-lg cursor-pointer hover:shadow-md text-slate-800 hover:bg-sky-200 hover:text-white'
                onClick={navigateTo} id={props.user.nickname}> 프로필 보러가기</div>


        </Modal>
    )
}

export default ProfileTodoModal