import React, { useEffect, useState } from 'react';

function App() {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/agencies')
      .then(res => res.json())
      .then(data => setAgencies(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {agencies.map(agency => (
        <div key={agency._id} className="border rounded p-4 shadow bg-white">
          <h2 className="font-bold">{agency.agency_name || agency.title}</h2>
          <p>{agency.project_title || agency.description}</p>
          {agency.media_url && (
            <img src={agency.media_url} alt={agency.project_title} className="mt-2 rounded"/>
          )}
          <a href={agency.project_url || agency.project_page_url} target="_blank" className="text-blue-500 mt-2 block">View Project</a>
        </div>
      ))}
    </div>
  );
}

export default App;
