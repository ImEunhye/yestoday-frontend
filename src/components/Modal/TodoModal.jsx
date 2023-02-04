import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

const TodoModal = props => {
    const [todos, setTodos] = useState([]);

    const dateFormat = (date) => {
        const dateFormatted = date.getFullYear() + '-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))
            + '-' + ((date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()));
        return dateFormatted;
    }
    console.log(dateFormat(new Date()));

    useEffect(() => {
        const getTodos = async () => {
            const response = await axios.get('http://localhost:8080/todos/users/' + props.user.userId + "/todo-date/" + dateFormat(new Date()));
            setTodos(response.data)
        }

        getTodos();

    }, [])

    const todoList = todos.map(todo => (
        todo.complete ?
            <li key={todo.todoId} className='flex w-full p-2 border-b-2 h-1/12'>
                <img className='w-1/12' src="images/checkmark.png" alt="" />
                <span className='line-through text-slate-400 '>{todo.todoName}</span>
            </li>
            :
            <li key={todo.todoId} className='flex w-full p-2 border-b-2 h-1/12'>
                <div className='w-1/12'></div>
                <span className=''>{todo.todoName}</span>
            </li>

    ))


    return (
        <Modal
            style={{
                overlay: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }
            }}
            className=' p-2 absolute -translate-x-1/2 -translate-y-1/2 bg-white border-2 outline-none w-[300px] h-[500px] rounded-xl top-1/2 left-1/2'
            onRequestClose={() => props.setIsClicked(false)}
            isOpen={true} ariaHideApp={false}>

            <header>
                <div className='flex h-10' >
                    <img className='w-10 h-10 mr-2'
                        src={props.user.profileImg} alt="" />
                    <span className='flex items-center text-sm'>{props.user.nickname} 님의</span>
                    <span className='flex items-center ml-2 font-serif text-sm font-bold'>  Today TodoList</span>

                </div>

            </header>


            <ul className='w-full mt-3 h-4/5'>
                {todoList}
            </ul>


        </Modal>
    )
}

export default TodoModal