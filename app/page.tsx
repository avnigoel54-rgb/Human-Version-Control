"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}


export default function Page() {
  // ======= STATES =======
  const [showForm, setShowForm] = useState(false);
  const [versions, setVersions] = useState<
  {
    name: string;
    notes: string;
    date: string;
    tags: string[];
    experiment: boolean;
    emotion: number;
  }[]
>([]);

  const [versionName, setVersionName] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [experimentChecked, setExperimentChecked] = useState(false);
  const [emotion, setEmotion] = useState(3);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [activeTab, setActiveTab] = useState<
  "timeline" | "diff" | "analytics" | "insights"
>("timeline");

  // ======= LOAD FROM LOCALSTORAGE =======
  useEffect(() => {
    const saved = localStorage.getItem("versions");
    if (saved) setVersions(JSON.parse(saved));
  }, []);

  // ======= SAVE TO LOCALSTORAGE =======
  useEffect(() => {
    localStorage.setItem("versions", JSON.stringify(versions));
  }, [versions]);

  // ======= ADD VERSION =======
  function handleAddVersion() {
    if (!versionName.trim()) return;
    setVersions([
      ...versions,
      {
        name: versionName,
        notes,
        date: new Date().toLocaleDateString(),
        tags: tagsInput.split(",").map((t) => t.trim()),
        experiment: experimentChecked,
emotion,

      },
    ]);
    setVersionName("");
    setNotes("");
    setTagsInput("");
    setExperimentChecked(false);
    setEmotion(3);
    setShowForm(false);
  }

  // ======= DELETE VERSION =======
  function handleDeleteVersion(index: number) {
    const updated = versions.filter((_, i) => i !== index);
    setVersions(updated);
  }

  // ======= SORT VERSIONS =======
  const sortedVersions = [...versions].sort((a, b) => {
    if (sortOrder === "newest") return b.date.localeCompare(a.date);
    return a.date.localeCompare(b.date);
  });

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold">Human Version Control 🚀</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add Version
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-indigo-50 p-6 border-r shadow-inner overflow-y-auto">
          <h2 className="font-bold mb-6 text-indigo-700 uppercase tracking-wide text-sm">Navigation</h2>
          <ul className="space-y-3 text-indigo-800 font-medium">
  <li
    onClick={() => setActiveTab("timeline")}
    className={`cursor-pointer transition ${
      activeTab === "timeline" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
    }`}
  >
    Timeline
  </li>

  <li
    onClick={() => setActiveTab("diff")}
    className={`cursor-pointer transition ${
      activeTab === "diff" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
    }`}
  >
    Diff View
  </li>

  <li
    onClick={() => setActiveTab("analytics")}
    className={`cursor-pointer transition ${
      activeTab === "analytics" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
    }`}
  >
    Analytics
  </li>

  <li
    onClick={() => setActiveTab("insights")}
    className={`cursor-pointer transition ${
      activeTab === "insights" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
    }`}
  >
    Insights
  </li>
</ul>

        </aside>

        {/* Main cards area */}
        <section className="flex-1 p-6 overflow-y-auto">

  {activeTab === "timeline" && (
    <>

          {/* Sort & total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Total Versions: {versions.length}</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="border rounded px-2 py-1"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Version Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVersions.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 text-center col-span-full">
                No versions yet.
              </div>
            ) : (
              sortedVersions.map((v, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-5 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300
                    ${v.experiment ? "bg-yellow-100 border-l-4 border-yellow-500" : "bg-white border-l-4 border-indigo-500"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{v.name}</h3>
                    {v.tags && v.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {v.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{v.notes}</p>
                  <p className="text-sm text-gray-500">{v.date}</p>
                  <button
                    onClick={() => handleDeleteVersion(i)}
                    className="mt-3 text-sm text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
              </>
  )}
  {activeTab === "analytics" && (
  <div className="space-y-6">

    <h2 className="text-2xl font-bold text-indigo-700">
      Analytics Dashboard 📊
    </h2>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Total Versions" value={versions.length} />
      <StatCard title="Experiments" value={versions.filter(v => v.experiment).length} />
      <StatCard title="Normal Builds" value={versions.filter(v => !v.experiment).length} />
      <StatCard title="Unique Tags" value={new Set(versions.flatMap(v => v.tags)).size} />
    </div>

    {/* Emotion Trend Chart */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Emotional Trend 📈</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={versions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="emotion" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Emotion Heatmap */}
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Emotion Heatmap 🧠</h3>

      <div className="grid grid-cols-7 gap-2">
        {versions.map((v, i) => (
          <div
            key={i}
            title={`${v.date} — Emotion: ${v.emotion}`}
            className={`w-6 h-6 rounded transition ${
              v.emotion === 1 ? "bg-red-500" :
              v.emotion === 2 ? "bg-orange-400" :
              v.emotion === 3 ? "bg-yellow-400" :
              v.emotion === 4 ? "bg-green-400" :
              "bg-green-600"
            }`}
          />
        ))}
      </div>
    </div>

  </div>
)}



        </section>
      </div>

      {/* Add Version Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl animate-slide-in">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">Add New Version</h3>

            <input
  className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
  placeholder="Version Name (e.g. v1.0)"
  value={versionName}
  onChange={(e) => setVersionName(e.target.value)}
/>

<textarea
  className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-900"
  placeholder="Notes / What changed?"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>

<input
  className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900"
  placeholder="Tags (comma separated)"
  value={tagsInput}
  onChange={(e) => setTagsInput(e.target.value)}
/>

            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Emotional State: {emotion} / 5
  </label>
  <input
    type="range"
    min={1}
    max={5}
    value={emotion}
    onChange={(e) => setEmotion(Number(e.target.value))}
    className="w-full accent-indigo-600"
  />
</div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={experimentChecked}
                onChange={(e) => setExperimentChecked(e.target.checked)}
                className="accent-yellow-500"
              />
              <label className="text-gray-700 font-medium">Mark as Experiment 🔬</label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddVersion}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition flex-1"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg shadow hover:bg-gray-300 transition flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
