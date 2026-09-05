import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'

const home = () => {
    const [formData,setformdata] = useState({
        username:'',
        email:''
    })
    const userref = useRef();

    const handlechange = (e)=>{
        const {value,name} = e.target;
        setformdata((values)=>({
            ...values,
            [name]:value
        }))
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(formData)
    }
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" value={formData.username} name="username" onChange={handlechange} />
        <input type="text" value={formData.email} name="email" onChange={handlechange} />
        <button ref={userref}></button>
      </form>
    </div>
  )
}

export default home
