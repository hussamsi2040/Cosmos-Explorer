import React, { useEffect, useState } from "react";

// Define a Career type
interface Career {
  title: string;
  description: string;
  skills: string[];
  videoId: string;
}

const SpaceCareersTab = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCareers() {
      setLoading(true);
      try {
        const data = await import("../data/careers.json");
        setCareers(data.default || data);
      } catch (e) {
        setError("Failed to load career data.");
      }
      setLoading(false);
    }
    loadCareers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-lg text-gray-300">Loading careers...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-lg text-red-400">{error}</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">👩‍🚀 Space Careers</h2>
      <div className="w-full max-w-3xl grid gap-8">
        {careers.map((career, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg flex flex-col gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-blue-200">{career.title}</h3>
              <p className="mb-2 text-gray-200">{career.description}</p>
              <div className="mb-2">
                <span className="font-semibold text-gray-300">Key Skills:</span>
                <ul className="list-disc list-inside ml-4 text-gray-100">
                  {career.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceCareersTab; 