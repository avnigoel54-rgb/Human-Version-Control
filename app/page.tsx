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
              className="w-full border rounded-lg p-2"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />

            <textarea
              className="w-full border rounded-lg p-2 resize-none"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />

            <input
              className="w-full border rounded-lg p-2"
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
                onClick={() => onDelete(index)}
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
  const [versions, setVersions] = useState<
    { name: string; notes: string; date: string; tags: string[]; experiment: boolean; emotion: number }[]
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

  useEffect(() => {
    const saved = localStorage.getItem("versions");
    if (saved) setVersions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("versions", JSON.stringify(versions));
  }, [versions]);

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

  function handleDeleteVersion(index: number) {
    const updated = versions.filter((_, i) => i !== index);
    setVersions(updated);
  }

  const sortedVersions = [...versions].sort((a, b) => {
    if (sortOrder === "newest") return b.date.localeCompare(a.date);
    return a.date.localeCompare(b.date);
  });

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
            {["timeline", "diff", "analytics", "insights"].map((tab) => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`cursor-pointer px-3 py-2 rounded-xl transition ${
                  activeTab === tab
                    ? "bg-white shadow text-indigo-700 font-bold"
                    : "hover:bg-white/60"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 p-6 overflow-y-auto">
          {activeTab === "timeline" && (
  <div className="space-y-10">

    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
      Life Version Timeline 📜
    </h2>

    {sortedVersions.length === 0 && (
      <p className="text-gray-500 italic">
        No versions saved yet. Start journaling your growth ✨
      </p>
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

              {/* Emotion Heatmap */}
              <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl p-6 shadow-lg border border-pink-100">
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                  Emotion Heatmap <span className="text-2xl">🧠</span>
                </h3>

                <div className="grid grid-cols-6 gap-4 place-items-center">
                  {versions.map((v, i) => (
                    <div
                      key={i}
                      title={`${v.date} — Emotion: ${v.emotion}`}
                      className={`w-10 h-10 rounded-xl shadow-md hover:scale-110 transition transform cursor-pointer ${
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
              className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 resize-none"
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
