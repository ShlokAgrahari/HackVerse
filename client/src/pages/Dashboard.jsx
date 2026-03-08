import { useState } from "react";
import Navbar from "../components/Navbar";
import HackathonCard from "../components/HackathonCard";
import useRecommendationStore from "../store/recommendationStore";

function Dashboard() {

 const [skills, setSkills] = useState("");

 const { results, loading, fetchRecommendations } = useRecommendationStore();

 const handleSearch = async () => {
  await fetchRecommendations(skills);
 };

 return (

  <div className="min-h-screen bg-gray-950 text-white">

   <Navbar />

   <div className="max-w-6xl mx-auto px-6 py-10">

    {/* Heading */}
    <h1 className="text-3xl font-bold mb-2">
     Find Hackathons
    </h1>

    <p className="text-gray-400 mb-8">
     Discover hackathons based on your skills
    </p>


    {/* Search Section */}
    <div className="flex flex-col md:flex-row gap-4 mb-10">

     <input
      type="text"
      placeholder="Enter skills (AI, ML, Python...)"
      className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={skills}
      onChange={(e) => setSkills(e.target.value)}
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


    {/* Results */}
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

     {results.map((hackathon, i) => (
      <HackathonCard key={i} hackathon={hackathon} />
     ))}

    </div>

   </div>

  </div>

 );
}

export default Dashboard;