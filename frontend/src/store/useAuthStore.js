import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set)=> ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async(data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      toast.success("Account Created Successfuly");
      set({authUser: res.data});
    } catch(err) {
      console.log("Error in signUp: " + err);
      toast.error(err.response.data.message);
    } finally {
      set({isSigningUp: false});
    }
  },
  login: async(data) => {
    set({isLoggingIn: true});
    try{
      const res = await axiosInstance.post('/auth/login', data);
      set({authUser: res.data});
      toast.success("Logged in Successfuly");
    }catch(err) {
      console.log("Error in login: " + err);
      toast.error(err.response.data.message);
    }finally {
      set({isLoggingIn: false});
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success("Logged Out Successfuly")
      set({authUser: null});      
    } catch(err) {
      console.log("Error in logOut: " + err);
      toast.error(err.response.data.message);

    }
  },
  updateProfile: async(data) =>{
    set({isUpdatingProfile: true})
    try{
      const res = await axiosInstance.put('/auth/update-profile',data);
      set({authUser: res.data});
      toast.success("Profile updated Successfully")
    }catch(err) {
      toast.error(err.response.data.message);
    }finally {
      set({isUpdatingProfile: false})
    }
  }

}))