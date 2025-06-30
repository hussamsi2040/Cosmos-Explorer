import React, { useState } from "react";

interface LessonStep {
  title: string;
  description: string;
}

// Placeholder for OpenAI API call
async function generateLessonPath(goal: string): Promise<LessonStep[]> {
  // In production, call your backend API route that proxies to OpenAI
  // For now, return a static example
  return [
    { title: `Introduction to ${goal}`, description: `Start with the basics of ${goal}.` },
    { title: `Watch a video about ${goal}`, description: `Find a YouTube video that explains ${goal}.` },
    { title: `Quiz: Test your knowledge of ${goal}`, description: `Take a short quiz to check your understanding.` },
    { title: `Hands-on Activity`, description: `Try a project or experiment related to ${goal}.` },
  ];
}

const LessonPathTab = () => {
  const [goal, setGoal] = useState("");
  const [lessonPath, setLessonPath] = useState<LessonStep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLessonPath(null);
    try {
      const steps = await generateLessonPath(goal);
      setLessonPath(steps);
    } catch (e) {
      setError("Failed to generate lesson path.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-[300px]">
      <h2 className="text-2xl font-bold mb-4">📚 AI-powered Lesson Path</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xl mb-6 flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-gray-400"
          placeholder="What do you want to learn this week? (e.g. planets)"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {lessonPath && (
        <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-200">Your Personalized Lesson Path</h3>
          <ol className="list-decimal list-inside text-gray-100">
            {lessonPath.map((step, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-bold">{step.title}:</span> {step.description}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default LessonPathTab; 