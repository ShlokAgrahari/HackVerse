import { create } from "zustand";
import api from "../services/api";

const useRecommendationStore = create((set) => ({

  results: [],
  loading: false,
  toolResult: null,

  fetchRecommendations: async (skills) => {

    try {

      set({
        loading: true
      });

      const res = await api.post(
        "/recommend",
        {
          query: skills
        }
      );

      console.log(
        "API response:",
        res.data
      );

      if (
        res.data.toolResult?.requiresGoogleAuth
      ) {

        localStorage.setItem(
          "pendingQuery",
          skills
        );

        window.location.href =
          res.data.toolResult.authUrl;

        return;
      }

      set({

        results:
          res.data.events || [],

        toolResult:
          res.data.toolResult || null,

        loading: false

      });

    } catch (err) {

      console.error(err);

      set({
        loading: false
      });

    }

  }

}));

export default useRecommendationStore;