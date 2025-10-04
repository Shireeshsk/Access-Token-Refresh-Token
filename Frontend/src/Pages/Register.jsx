import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
export default function Register(){
    const {register} = useAuthStore()
    const [data,setData] = useState({
        username : "",
        email : "",
        password : ""
    })

    function handleChange(e){
        const {name,value} = e.target
        setData(prev=>({
            ...prev,
            [name]:value
        }))
    }

    function handleSubmit(e){
        e.preventDefault()
        // console.log(data)
        register(data)
        setData({
            username : "",
            email : "",
            password : ""
        })
    }

    return(
        <div>
            <br /><br />
            <form onSubmit={handleSubmit}>
                <label>
                    UserName : 
                    <input type="text" name = "username" value = {data.username} placeholder="Enter UserName" onChange={handleChange}/>
                </label>
                <br /><br />
                <label>
                    Email : 
                    <input type="email" name = "email" value = {data.email} placeholder="Enter Email" onChange={handleChange}/>
                </label>
                <br /><br />
                <label>
                    UserName : 
                    <input type="password" name = "password" value = {data.password} placeholder="Enter Password" onChange={handleChange}/>
                </label>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <p>Already have an Account?<Link to='/login'>Sign in</Link></p>
        </div>
    )
}