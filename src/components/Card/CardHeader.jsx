import React from "react";

const CardHeader = props => {
    const addTodoHandler = (event) => {
        const enteredValue = event.target.value;


        if (event.key === 'Enter') {
            props.onAdd(enteredValue);
            // console.log(enterdValue);
            event.target.value = '';
        }
    }

    return (
        <div>
            <input type='text'
                maxLength={20}
                className='w-full p-4 mb-3 rounded-lg outline-none h-14 text-md placeholder:font-semibold placeholder:text-gray-300 placeholder:text-md'
                placeholder='오늘의 Todo를 작성해주세요'
                onKeyDown={addTodoHandler}
            ></input>
        </div >
    )

}
export default CardHeader;