import { create } from "zustand";
import api from "../services/api";

const useRecommendationStore = create((set)=>({

 results: [],
 loading: false,

 fetchRecommendations: async (skills)=>{

  set({loading:true});

  const res = await api.post("/recommend",{
   skills
  });

  set({
   results: res.data,
   loading:false
  });

 }

}));

export default useRecommendationStore;