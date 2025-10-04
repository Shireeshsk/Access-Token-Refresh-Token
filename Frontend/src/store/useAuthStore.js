import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../utils/axiosInstance'
export const useAuthStore = create((set,get)=>({
    token : null,
    loading : false,
    register: async(data)=>{
        set({loading:true})
        try{
            const res = await axiosInstance.post('/auth/register',data)
            set({token : res.data.accessToken})
            toast.success("Account Created Successfully")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            set({loading:true})
        }
    },
    login : async(data)=>{
        set({loading:true})
        try{
            const res = await axiosInstance.post('/auth/login',data)
            set({token : res.data.accessToken})
            toast.success("Login Successful")
        }catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            set({loading:false})
        }
    },
    refresh : async()=>{
        set({loading:true})
        try{
            const res = await axiosInstance.post('/auth/refresh-token')
            set({token : res.data.accessToken})
        }catch(err){
            set({token:null})
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            set({loading:false})
        }
    },
    logout : async()=>{
        set({loading:true})
        try{
            const res = await axiosInstance.post('/auth/logout')
            set({token : null})
        }catch(err){
            set({token:null})
            toast.error(err.response?.data?.message || "Something went wrong")
        }finally{
            set({loading:false})
        }
    }
}))