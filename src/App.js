import React, { useEffect, useState } from "react";

function App() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      console.log("fetsssch");
      try {
        const response = await fetch(
          "https://gmeet-node-ls52.vercel.app/participants"
        );
        console.log("responsssse");
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    const intervalId = setInterval(fetchParticipants, 5000); // Fetch participants every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <h1>Google Meet Participants</h1>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
