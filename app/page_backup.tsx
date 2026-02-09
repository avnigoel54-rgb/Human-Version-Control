"use client";
import { useState, useEffect } from "react";
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [versions, setVersions] = useState<
  { name: string; notes: string; date: string }[]
>([]);
const [versionName, setVersionName] = useState("");
const [notes, setNotes] = useState("");
function handleAddVersion() {
  console.log("SAVE CLICKED");
  if (!versionName.trim()) return;

  setVersions([ 
    ...versions,
    {
      name: versionName,
      notes,
      date: new Date().toLocaleDateString(),
    },
  ]);

  setVersionName("");
  setNotes("");
  setShowForm(false);
}
useEffect(() => {
  const saved = localStorage.getItem("versions");

  if (saved) {
    setVersions(JSON.parse(saved));
  }
}, []);
useEffect(() => {
  localStorage.setItem("versions", JSON.stringify(versions));
}, [versions]);
function handleDeleteVersion(index: number) {
  const updated = versions.filter((_, i) => i !== index);
  setVersions(updated);
}
const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
const sortedVersions = [...versions].sort((a, b) => {
  if (sortOrder === "newest") return b.date.localeCompare(a.date);
  return a.date.localeCompare(b.date);
});

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[500px]">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Human Version Control 🚀
        </h1>
        <p className="mt-4 text-gray-700 text-center">
  Track your personal growth like code.
</p>
<button
  onClick={() => setShowForm(true)}
  className="mt-6 bg-black text-white px-4 py-2 rounded w-full"
>
  Add New Version
</button>


{showForm && (
  <div className="mt-6 border border-gray-300 rounded-lg p-5 bg-gray-50">
    <h3 className="font-semibold mb-3 text-gray-800">
  New Version
</h3>
    <input
   className="w-full border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
  placeholder="Version Name (e.g. v1.0, v2.0)"
  value={versionName}
  onChange={(e) => setVersionName(e.target.value)}
></input> 

    <textarea
  placeholder="What changed?"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  className="w-full border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:outline-none"

/>
<div className="flex gap-2 mt-3">
  <button
    onClick={handleAddVersion}
    className="bg-black text-white px-4 py-2 rounded"
  >
    Save Version
  </button>

  <button
    onClick={() => setShowForm(false)}
  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
  >
    Cancel
  </button>
</div>
  </div>
)}
<div className="flex justify-between items-center mb-3">
  <span className="text-sm text-gray-600">
    Total: {versions.length}
  </span>

  <select
    value={sortOrder}
    onChange={(e) =>
      setSortOrder(e.target.value as "newest" | "oldest")
    }
    className="border rounded px-2 py-1"
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
  </select>
</div>

<div className="mt-10 w-full">
 <h2 className="text-xl font-bold text-gray-800 mb-4">
    Your Versions
  </h2>

  {versions.length === 0 ? (
  <div className="border rounded-lg p-4 text-gray-500">
    No versions yet.
  </div>
) : (
  <div className="space-y-3">
    {sortedVersions.map((v, i) => (
      <div
  key={i}
  className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
>
        <h3 className="text-lg font-semibold text-gray-900">
  {v.name}
</h3>

        <p className="text-gray-800">{v.notes}</p>

        <p className="text-sm text-gray-500">{v.date}</p>
        <button
  onClick={() => handleDeleteVersion(i)}
  className="mt-3 text-sm text-red-600 hover:underline"
>
  Delete
</button>
      </div>
    ))}
  </div>
)}

</div>

      </div>
    </main>
  );
}
