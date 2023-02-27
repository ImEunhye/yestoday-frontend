import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import SaveModal from './Modal/SaveModal';
import SideBar from './SideBar';
import MainFeed from './MainFeed';
import Card from './Card/Card';
import CardHeader from './Card/CardHeader';
import CardBody from './Card/CardBody';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';


const baseUrl = 'http://54.248.66.164:8080/api/todo'
const token = localStorage.getItem('accessToken')

axios.defaults.baseURL = 'http://54.248.66.164:8080';
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
console.log(token);

const HomePage = props => {
    const [refresh, setRefresh] = useState(1);
    const [todoRefresh, setTodoRefresh] = useState(1);
    const [saveIsOpen, setSaveIsOpen] = useState(false);
    const location = useLocation();
    const userId = location.state;
    
    console.log(userId + "dkdkdkdkd");
    const showModal = () => {
        setSaveIsOpen(true);
    }

    const dateFormat = (date) => {

        const dateFormatted = date.getFullYear() + '-' + ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))
            + '-' + ((date.getDate()) < 10 ? "0" + (date.getDate()) : (date.getDate()));
        return dateFormatted;
    }
    const todayDate = dateFormat(new Date())


    const [todos, setTodos] = useState([]);

    useEffect(() => {
        axios.get("/api/todo/users/" + userId + "/todo-date/" + todayDate)
            .then(response => response.data)
            .then(data => {
                setTodos(data)
            });


    }, [todoRefresh]);
    const addTodoHandler = enteredValue => {
        const newTodo = {
            name: enteredValue,
            userId: userId,
            completeState: false,
            todoDate: todayDate

        }
        axios.post(baseUrl, JSON.stringify(newTodo), {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.data)
            .then(data => setTodos(data));

    }
    const updateTodoHandler = (id, name) => {
        // const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, name } : todo);
        // console.log(updatedTodos);
        // setTodos(updatedTodos);
        const updateTodo = {
            id: id,
            name: name
        }
        fetch(baseUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(updateTodo),
        }).then(response => response.json())
            .then(data => setTodos(data));

    }
    //완료 todo
    const checkedTodoHandler = (id) => {
        console.log(id);
        fetch(baseUrl + '/todocomplete?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => response.json())


    }


    // Todo 딜리트
    const deleteTodoHandler = (id) => {
        fetch(baseUrl + '?id=' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => response.json())
            .then(data => setTodos(data));


    }
    return (
        <div className='flex justify-center'>
            <div className='hidden border-r-2 sm:hidden md:inline md:w-1/3 lg:w-1/4 xl:w-1/6'>
                <SideBar setSaveIsOpen={setSaveIsOpen} userId={userId} />
            </div>
            <div className='flex justify-center sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-3/5'>
                <MainFeed userId={userId} />
            </div>
            <div className='hidden h-fit sm:hidden md:hidden lg:inline lg:w-1/3'>

                <Card>

                    <CardHeader onAdd={addTodoHandler} />
                    <CardBody todos={todos} onDelete={deleteTodoHandler} onUpdate={updateTodoHandler} onChecked={checkedTodoHandler} />

                </Card>
            </div>
            {saveIsOpen && <SaveModal setSaveIsOpen={setSaveIsOpen} />}
        </div>

    )
}

export default HomePage