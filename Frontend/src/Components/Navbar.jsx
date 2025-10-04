import { Link , useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"
export default function Navbar(){
    const {token,logout} = useAuthStore()
    const navigate = useNavigate()
    const handleLogout = async () => {
        await logout();
        navigate('/login'); 
    }
    return(
        <div>
            <Link to ='/'>Home</Link>
            <Link to ='/login'>Login</Link>
            <Link to ='/register'>Register</Link>
            {token && <button onClick={handleLogout}>Logout</button>}
            
        </div>
    )
}