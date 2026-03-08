function HackathonCard({ hackathon }) {

 return (

  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md hover:shadow-purple-500/10 transition">

   <h2 className="text-lg font-semibold text-white mb-1">
    {hackathon.title}
   </h2>

   <p className="text-sm text-gray-400 mb-3">
    Organized by <span className="text-purple-400">{hackathon.organization}</span>
   </p>

   <div className="flex flex-wrap gap-2 mb-4">

    {hackathon.skills.map((skill, index) => (
     <span
      key={index}
      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
     >
      {skill}
     </span>
    ))}

   </div>

   <a
    href={hackathon.url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1.5 rounded text-sm hover:opacity-90 transition"
   >
    View Hackathon
   </a>

  </div>

 );

}

export default HackathonCard;