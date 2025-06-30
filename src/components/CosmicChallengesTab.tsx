import React, { useEffect, useState } from "react";

interface Challenge {
  week: number;
  title: string;
  description: string;
}

const LOCAL_KEY = "cosmic_challenges_completed";

const CosmicChallengesTab = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      const data = await import("../data/challenges.json");
      setChallenges(data.default || data);
      setLoading(false);
    }
    loadChallenges();
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setCompleted(JSON.parse(stored));
  }, []);

  const currentWeek = challenges.length ? Math.max(...challenges.map(c => c.week)) : 1;
  const thisChallenge = challenges.find(c => c.week === currentWeek);

  const markComplete = (week: number) => {
    const updated = [...completed, week];
    setCompleted(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  };

  if (loading) return <div className="text-gray-300">Loading challenge...</div>;

  return (
    <div className="p-6 flex flex-col items-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">🧪 Cosmic Challenge of the Week</h2>
      {thisChallenge && (
        <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg mb-8">
          <h3 className="text-xl font-semibold mb-2 text-blue-200">{thisChallenge.title}</h3>
          <p className="mb-4 text-gray-200">{thisChallenge.description}</p>
          {completed.includes(thisChallenge.week) ? (
            <span className="text-green-400 font-bold">Completed!</span>
          ) : (
            <button
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
              onClick={() => markComplete(thisChallenge.week)}
            >
              Mark as Complete
            </button>
          )}
        </div>
      )}
      <div className="w-full max-w-xl">
        <h4 className="text-lg font-semibold mb-2 text-gray-300">Challenge History</h4>
        <ul className="list-disc list-inside text-gray-100">
          {challenges.map((c) => (
            <li key={c.week} className={completed.includes(c.week) ? "text-green-400" : ""}>
              Week {c.week}: {c.title} {completed.includes(c.week) && "✓"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CosmicChallengesTab; 