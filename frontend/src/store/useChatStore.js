import toast from "react-hot-toast";
import {create} from "zustand"
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set)=>({
  messages:[],
  users:[],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getUsers: async() =>{
    set({isUsersLoading: true})
    try {
      const res = await axiosInstance.get("/messages/users");
      set({users:res.data});  
    } catch(err) {
      toast.error(err.response.data.message);
    } finally{
      set({isUsersLoading: false});
    }
  },
  getMessages: async(userId) =>{
    set({isMessagesLoading: true});
    try{
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({messages: res.data});
    }catch(err) {
      toast.error(err.response.data.message);
    }finally{
      set({isMessagesLoading: false});
    }
  },
  // TODO: optimize it later
  setSelectedUser: (selectedUser)=> {
    set({selectedUser: selectedUser})
  }
}))