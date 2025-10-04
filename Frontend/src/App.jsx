import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import { useAuthStore } from './store/useAuthStore'
import Indication from './Indication'
import './App.css'
import { useEffect } from 'react'
export default function App(){
  const {token,refresh,loading} = useAuthStore()
  useEffect(()=>{
    const init = async () => {
      await refresh();
    };
    init();
  },[])
  if (loading) return <div>Loading...</div>
  return(
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={token?<Indication />:<Home />} />
        <Route path='/login' element={token?<Indication/>:<Login />} />
        <Route path='/register' element={token?<Indication/>:<Register />} />
      </Routes>
    </BrowserRouter>
  )
}