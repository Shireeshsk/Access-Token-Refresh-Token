import { useState } from "react"
import {Link} from 'react-router-dom'
import { useAuthStore } from "../store/useAuthStore"
export default function Login(){
    const {login} = useAuthStore()
    const [data,setData] = useState({
        username : "",
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
        console.log(data)
        login(data)
        setData({
            username : "",
            password : ""
        })
    }
    return(
        <div>
            <br /><br />
            <form onSubmit={handleSubmit}>
                <label >
                    UserName : 
                    <input type="text" name = "username" value = {data.username} placeholder="Enter UserName" onChange={handleChange}/>
                </label>
                <br /><br />
                <label >
                    Password : 
                    <input type="password" name = "password" value = {data.password} placeholder="Enter Password" onChange={handleChange}/>
                </label>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <p>Don't have an Account?<Link to='/register'>CreateAccount</Link></p>
        </div>
    )
}