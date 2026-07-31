import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HackathonCard from "../components/HackathonCard";
import useRecommendationStore from "../store/recommendationStore";
import api from "../services/api";

function Dashboard() {
  const [skills, setSkills] = useState("");
  const [savedIds, setSavedIds] = useState([]);

  const {
    results,
    loading,
    toolResult,
    fetchRecommendations,
  } = useRecommendationStore();

  const handleSearch = async () => {
    if (!skills.trim()) return;

    await fetchRecommendations(skills);
  };

  // Fetch saved hackathons
  useEffect(() => {
    const fetchSavedHackathons = async () => {
      try {
        const res = await api.get(
          "/hackathons/saved"
        );

        setSavedIds(
          res.data.map((h) => h._id)
        );
      } catch (err) {
        console.error(
          "Error fetching saved hackathons",
          err
        );
      }
    };

    fetchSavedHackathons();
  }, []);

  // Resume query after Google OAuth
  useEffect(() => {
    const pendingQuery =
      localStorage.getItem(
        "pendingQuery"
      );

    if (!pendingQuery) return;

    localStorage.removeItem(
      "pendingQuery"
    );

    fetchRecommendations(
      pendingQuery
    );
  }, [fetchRecommendations]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">
          Find Hackathons
        </h1>

        <p className="text-gray-400 mb-8">
          Discover hackathons based on your
          skills
        </p>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter skills (AI, ML, Python...)"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
          />

          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-400 mb-6">
            Finding hackathons...
          </p>
        )}

        {/* Calendar Success */}
        {toolResult?.success &&
          toolResult?.type ===
            "calendar" && (
            <div className="mb-6 p-4 rounded-lg bg-green-900 border border-green-700">
              <p className="font-semibold">
                ✅ Added to Google Calendar
              </p>

              {toolResult.eventLink && (
                <a
                  href={
                    toolResult.eventLink
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-300 underline"
                >
                  Open Calendar Event
                </a>
              )}
            </div>
          )}

        {/* Calendar Failure */}
        {toolResult &&
          toolResult.success === false &&
          !toolResult.requiresGoogleAuth && (
            <div className="mb-6 p-4 rounded-lg bg-red-900 border border-red-700">
              ❌ Failed to create calendar
              event
            </div>
          )}

        {/* Results */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results?.length > 0 ? (
            results.map((hackathon) => (
              <HackathonCard
                key={hackathon._id}
                hackathon={hackathon}
                initiallySaved={savedIds.includes(
                  hackathon._id
                )}
              />
            ))
          ) : (
            !loading && (
              <p className="text-gray-500">
                No hackathons found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;