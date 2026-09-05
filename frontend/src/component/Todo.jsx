import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'

const Todo = () => {
    const [formData,setformdata] = useState({
        title:'',
        description:''
    })
    const [editId,setEditId] = useState(null);
    const [todos,setTodo] = useState([]);
    const handlechange = (e)=>{
        const {value,name} = e.target;
        setformdata((values)=>({
            ...values,
            [name]:value
        }))
    }
    const handleSubmit = (e)=>{


        e.preventDefault();

        if(editId !== null){
            console.log("hello")
            setTodo((Prevtodos)=>(
                Prevtodos.map((todo)=>(
                    (todo.id == editId) ? {...todo,...formData}:todo
                ))
            ))
             setEditId(null);
        }else{
             const newTodo = {
            ...formData,
            id:Date.now()
        }
        setTodo((prevTodos) => [
               newTodo,
            ...prevTodos
        ])
        }
         setformdata({
            description:'',
            title:''
         })
        console.log(todos)
    }

    const HandleEdit = (todo)=>{
          setformdata({
            description:todo.description,
            title:todo.title
          })
          setEditId(todo.id)
    }
    const HandleDelete = (todo)=>{
        setTodo((oldtodos)=>(
            oldtodos.filter((currtodo)=>(
                todo !== currtodo 
            ))
        ))
    }
    console.log(todos)
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" value={formData.title} name="title" onChange={handlechange} />
        <input type="text" value={formData.description} name="description" onChange={handlechange} />
        <button>addd</button>
      </form>
      {todos && (
        <div>
           {todos.map((todo, index) => (
                <div key={index}>
                    <p>{todo.title}</p>
                    <p>{todo.description}</p>
                     <button onClick={()=>HandleEdit(todo)} >edit</button>
                     <button onClick={()=>HandleDelete(todo)} >delete</button>
                </div>
            ))}
        </div>
      )}

    </div>
  )
}

export default Todo
