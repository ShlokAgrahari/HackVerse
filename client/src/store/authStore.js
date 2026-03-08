import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({

 user: null,
 token: localStorage.getItem("token") || null,

 signup: async (name, email, phone, password) => {

  await api.post("/auth/signup", {
   name,
   email,
   phone,
   password
  });

 },

 login: async (email, password) => {

  const res = await api.post("/auth/login", {
   email,
   password
  });

  const { token, user } = res.data;

  localStorage.setItem("token", token);

  set({
   user,
   token
  });

 },

 logout: () => {

  localStorage.removeItem("token");

  set({
   user: null,
   token: null
  });

 }

}));

export default useAuthStore;