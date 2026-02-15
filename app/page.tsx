"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-4 rounded-2xl shadow-md hover:shadow-xl transition border border-indigo-100">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
function TimelineCard({
  version,
  index,
  onDelete,
  onUpdate
}: {
  version: any;
  index: number;
  onDelete: (i: number) => void;
  onUpdate: (v: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(version);

  return (
    <div className="relative">

      <div className="absolute -left-[43px] top-6 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white shadow" />

      <div className="bg-white rounded-2xl shadow p-6 border border-indigo-100">

        {editing ? (
          <div className="space-y-3">

            <input
              className="w-full border border-indigo-300 bg-white p-3 rounded-xl text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-500"

              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />

            <textarea
              className="w-full border border-indigo-300 bg-white p-3 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"

              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />

            <input
              className="w-full border border-indigo-300 bg-white p-3 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"

              value={draft.tags.join(", ")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  tags: e.target.value.split(",").map((t: string) => t.trim())
                })
              }
            />

            <div>
              <label className="text-sm text-gray-600">
                Emotion: {draft.emotion} / 5
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={draft.emotion}
                onChange={(e) =>
                  setDraft({ ...draft, emotion: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onUpdate(draft);
                  setEditing(false);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setDraft(version);
                  setEditing(false);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-indigo-700">
                  {version.name}
                </h3>
                <p className="text-sm text-gray-500">{version.date}</p>
              </div>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this version?")) {
                    onDelete(index);
                  }
                }}

                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>

            <p className="mt-3 text-gray-700">{version.notes}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {version.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Emotion: {version.emotion} / 5
              </span>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <span>Confidence: {version.traits?.confidence ?? 5}</span>
                <span>Stress: {version.traits?.stress ?? 5}</span>
                <span>Energy: {version.traits?.energy ?? 5}</span>
                <span>Focus: {version.traits?.focus ?? 5}</span>
              </div>


              <button
                onClick={() => setEditing(true)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Edit ✏️
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [versions, setVersions] = useState<
    {
      name: string;
      notes: string;
      date: string;
      tags: string[];
      experiment: boolean;
      emotion: number;
      traits: {
        confidence: number;
        stress: number;
        energy: number;
        focus: number;
      };
    }[]
  >([]);
  const [versionName, setVersionName] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [experimentChecked, setExperimentChecked] = useState(false);
  const [emotion, setEmotion] = useState(3);
  const [confidence, setConfidence] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [versionA, setVersionA] = useState<number | null>(null);
  const [versionB, setVersionB] = useState<number | null>(null);


  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [activeTab, setActiveTab] = useState<
    "timeline" | "diff" | "analytics" | "insights"
  >("timeline");

  useEffect(() => {
  try {
    const saved = localStorage.getItem("versions");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setVersions(parsed);
      }
    }
  } catch (error) {
    console.error("Failed to load versions from localStorage:", error);
  }
}, []);




  useEffect(() => {
    localStorage.setItem("versions", JSON.stringify(versions));
  }, [versions]);

  function handleAddVersion() {
    if (!versionName.trim()) {
      alert("Version name cannot be empty.");
      return;
    }

    setVersions([
      ...versions,
      {
        name: versionName,
        notes,
        date: new Date().toLocaleDateString(),
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        experiment: experimentChecked,
        emotion: emotion ?? 3,
        traits: {
          confidence: confidence ?? 5,
          stress: stress ?? 5,
          energy: energy ?? 5,
          focus: focus ?? 5,
        },
      }

    ]);
    setMessage("Version saved successfully 🚀");

    setTimeout(() => {
      setMessage(null);
    }, 2500);


    setVersionName("");
    setNotes("");
    setConfidence(5);
    setStress(5);
    setEnergy(5);
    setFocus(5);

    setTagsInput("");
    setExperimentChecked(false);
    setEmotion(3);
    setShowForm(false);
  }

  function handleDeleteVersion(index: number) {
    const updated = versions.filter((_, i) => i !== index);
    setVersions(updated);
  }

  const sortedVersions = [...versions].sort((a, b) => {
    if (sortOrder === "newest") return b.date.localeCompare(a.date);
    return a.date.localeCompare(b.date);
  });
  const average = (key: "confidence" | "stress" | "energy" | "focus") => {
    if (versions.length === 0) return 0;

    const total = versions.reduce((sum, v) => {
      return sum + (v.traits?.[key] ?? 5);
    }, 0);

    return Math.round(total / versions.length);
  };
  const growth = (key: "confidence" | "stress" | "energy" | "focus") => {
    if (versions.length < 2) return 0;

    const first = versions[0]?.traits?.[key] ?? 5;
    const last = versions[versions.length - 1]?.traits?.[key] ?? 5;

    return last - first;
  };


  const generateReflection = () => {
  if (versions.length < 2) {
    return "Not enough data yet. Add more versions to unlock AI insights.";
  }

  const confidenceGrowth = growth("confidence");
  const stressGrowth = growth("stress");
  const energyGrowth = growth("energy");
  const focusGrowth = growth("focus");

  const improvements: string[] = [];
  const declines: string[] = [];

  if (confidenceGrowth > 0) improvements.push("confidence");
  if (energyGrowth > 0) improvements.push("energy");
  if (focusGrowth > 0) improvements.push("focus");
  if (stressGrowth < 0) improvements.push("stress management");

  if (confidenceGrowth < 0) declines.push("confidence");
  if (energyGrowth < 0) declines.push("energy");
  if (focusGrowth < 0) declines.push("focus");
  if (stressGrowth > 0) declines.push("stress levels");

  let message = "";

  if (improvements.length > 0) {
    message += `Great progress in ${improvements.join(", ")}. `;
  }

  if (declines.length > 0) {
    message += `Be mindful of ${declines.join(", ")}. `;
  }

  if (improvements.length === 0 && declines.length === 0) {
    message += "Your metrics are stable. Consistency is your strength.";
  }

  message += " Keep tracking to see long-term growth patterns.";

  return message;
};



  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-orange-50 flex flex-col">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold tracking-wide">Human Version Control 🚀</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          + Add Version
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gradient-to-b from-indigo-100 to-purple-100 p-6 border-r shadow-inner">
          <h2 className="font-bold mb-6 text-indigo-700 uppercase tracking-wide text-sm">
            Navigation
          </h2>
          <ul className="space-y-3 text-indigo-900 font-medium">
            {["timeline", "difference", "analytics", "insights"].map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`cursor-pointer px-3 py-2 rounded-xl transition ${activeTab === tab
                    ? "bg-white shadow text-indigo-700 font-bold"
                    : "hover:bg-white/60"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ul>
        </aside>
        {message && (
          <div className="absolute top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50">
            {message}
          </div>
        )}

        <section className="flex-1 p-6 overflow-y-auto">
          {activeTab === "timeline" && (
            <div className="space-y-10">

              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Life Version Timeline 📜
              </h2>

              {sortedVersions.length === 0 && (
                <div className="text-gray-500 italic">
                  <div className="bg-white p-8 rounded-2xl shadow border border-indigo-100 text-center">
                    <p className="text-gray-500 italic mb-3">
                      No versions saved yet.
                    </p>
                    <p className="text-indigo-600 font-medium">
                      Click "+ Add Version" to start tracking your growth 🚀
                    </p>
                  </div>

                </div>
              )}

              <div className="relative border-l-4 border-indigo-200 pl-8 space-y-10">

                {sortedVersions.map((v, i) => (
                  <TimelineCard
                    key={i}
                    index={i}
                    version={v}
                    onDelete={handleDeleteVersion}
                    onUpdate={(updated) => {
                      const copy = [...versions];
                      copy[i] = updated;
                      setVersions(copy);
                    }}
                  />
                ))}

              </div>

            </div>
          )}

          {activeTab === "diff" && (
            <div className="space-y-8">

              {/* Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Difference View 🔍
              </h2>

              {/* Selector Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 flex flex-col md:flex-row gap-6">

                {/* Version A */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Select Version A
                  </label>
                  <select
                    value={versionA ?? ""}
                    onChange={(e) =>
                      setVersionA(e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full p-3 rounded-xl border border-indigo-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled hidden>
                      Choose version
                    </option>
                    {versions.map((v, i) => (
                      <option key={i} value={i} className="text-gray-800">
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Version B */}
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Select Version B
                  </label>
                  <select
                    value={versionB ?? ""}
                    onChange={(e) =>
                      setVersionB(e.target.value === "" ? null : Number(e.target.value))
                    }
                    className="w-full p-3 rounded-xl border border-pink-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="" disabled hidden>
                      Choose version
                    </option>
                    {versions.map((v, i) => (
                      <option key={i} value={i} className="text-gray-800">
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Diff Result */}
              {versionA !== null && versionB !== null && (
                <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 p-8 space-y-6">

                  <h3 className="text-xl font-bold text-indigo-700">
                    Trait Comparison
                  </h3>

                  {(["confidence", "stress", "energy", "focus"] as const).map((trait) => {

                    const a = versions[versionA]?.traits?.[trait] ?? 5;
                    const b = versions[versionB]?.traits?.[trait] ?? 5;
                    const diff = b - a;

                    return (
                      <div
                        key={trait}
                        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-2xl border border-indigo-100"
                      >
                        <span className="capitalize font-semibold text-gray-700 w-1/4">
                          {trait}
                        </span>

                        <span className="text-gray-600 w-1/4 text-center">
                          {a}
                        </span>

                        <span className="text-gray-400 w-1/4 text-center">
                          →
                        </span>

                        <span className="w-1/4 text-center font-bold">
                          <span className="text-gray-800">{b}</span>{" "}
                          <span
                            className={
                              diff > 0
                                ? "text-green-600"
                                : diff < 0
                                  ? "text-red-500"
                                  : "text-gray-500"
                            }
                          >
                            ({diff > 0 ? "+" : ""}{diff})
                          </span>
                        </span>
                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

          {activeTab === "insights" && (
  <div className="space-y-8">

    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
      Growth Insights 🧠
    </h2>

    {versions.length < 2 ? (
      <p className="text-gray-500 italic">
        Add at least two versions to generate insights.
      </p>
    ) : (
      <div className="space-y-6">

        {/* Growth Summary */}
        <div className="bg-white p-6 rounded-2xl shadow border border-indigo-100">
          <h3 className="font-bold text-indigo-700 mb-3">
            📈 Growth Summary
          </h3>

          <p className="text-gray-700">
            Confidence change: <span className="font-semibold">{growth("confidence")}</span>
          </p>

          <p className="text-gray-700">
            Stress change: <span className="font-semibold">{growth("stress")}</span>
          </p>

          <p className="text-gray-700">
            Energy change: <span className="font-semibold">{growth("energy")}</span>
          </p>

          <p className="text-gray-700">
            Focus change: <span className="font-semibold">{growth("focus")}</span>
          </p>
        </div>

        {/* Suggested Next Step */}
        <div className="bg-gradient-to-br from-indigo-50 to-pink-50 p-6 rounded-2xl shadow border border-pink-100">
          <h3 className="font-bold text-pink-600 mb-3">
            🧭 Suggested Next Step
          </h3>

          <p className="text-gray-700">
            Keep building small daily improvements. Focus especially on the
            trait that decreased the most and reinforce habits that improved
            your strongest area.
          </p>
        </div>

        {/* AI Reflection */}
        <div className="bg-white p-6 rounded-2xl shadow border border-indigo-200">
          <h3 className="font-bold text-indigo-600 mb-3">
            🤖 AI Reflection
          </h3>
          <p className="text-gray-700">
            {generateReflection()}
          </p>
        </div>

      </div>
    )}

  </div>
)}




          {activeTab === "analytics" && (
            <div className="space-y-8">

              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
                Analytics Dashboard <span>📊</span>
              </h2>

              <p className="italic text-gray-500">
                Your personal emotional growth journal ✨
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Versions" value={versions.length} />
                <StatCard title="Experiments" value={versions.filter(v => v.experiment).length} />
                <StatCard title="Normal Builds" value={versions.filter(v => !v.experiment).length} />
                <StatCard title="Unique Tags" value={new Set(versions.flatMap(v => v.tags)).size} />
                <StatCard title="Avg Confidence" value={average("confidence")} />
                <StatCard title="Avg Stress" value={average("stress")} />
                <StatCard title="Avg Energy" value={average("energy")} />
                <StatCard title="Avg Focus" value={average("focus")} />

              </div>

              {/* Emotional Trend */}
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  Emotional Trend <span className="text-2xl">📈</span>
                </h3>

                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={versions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="emotion" strokeWidth={3} stroke="#6366F1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow border border-indigo-100">
                <h3 className="font-bold text-indigo-700 mb-2">
                  Growth Summary
                </h3>

                <p className="text-gray-700">
                  Confidence change: {growth("confidence")}
                </p>
                <p className="text-gray-700">
                  Stress change: {growth("stress")}
                </p>
                <p className="text-gray-700">
                  Energy change: {growth("energy")}
                </p>
                <p className="text-gray-700">
                  Focus change: {growth("focus")}
                </p>
              </div>


              {/* Emotion Heatmap */}
              {/* Emotion Heatmap */}
              <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-lg border border-pink-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  Emotion Heatmap <span className="text-2xl">🧠</span>
                </h3>

                <div className="grid grid-cols-7 gap-2">
                  {versions.map((v, i) => (
                    <div
                      key={i}
                      title={`${v.date} — Emotion: ${v.emotion}`}
                      className={`h-10 w-full rounded-lg transition transform hover:scale-105 ${v.emotion === 1
                          ? "bg-gradient-to-br from-red-400 to-red-600"
                          : v.emotion === 2
                            ? "bg-gradient-to-br from-orange-300 to-orange-500"
                            : v.emotion === 3
                              ? "bg-gradient-to-br from-yellow-300 to-yellow-500"
                              : v.emotion === 4
                                ? "bg-gradient-to-br from-green-300 to-green-500"
                                : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                        }`}
                    />
                  ))}
                </div>


              </div>


            </div>
          )}
        </section>
      </div>

      {/* Modal remains unchanged except visuals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl border border-indigo-100">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Add New Version ✨
            </h3>

            <input
              className="w-full border border-gray-300 p-3 rounded-xl mb-3 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"

              placeholder="Version Name eg: V1.0"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
            />

            <textarea
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800 placeholder-gray-400"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 resize-none placeholder:text-gray-500 placeholder:font-medium text-gray-900 font-medium"

              placeholder="Tags"
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
            {/* Confidence */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidence: {confidence} / 10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Stress */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stress: {stress} / 10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            {/* Energy */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy: {energy} / 10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-green-500"
              />
            </div>

            {/* Focus */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus: {focus} / 10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
                className="w-full accent-purple-500"
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
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition flex-1"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-xl shadow hover:bg-gray-300 transition flex-1"
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