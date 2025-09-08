"use client";
import { useEffect, useState } from "react";

type Task = { id:number; title:string; description?:string|null; done:boolean };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => { load(); }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    setLoading(false);
    load();
  }

  async function toggle(id:number, done:boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    load();
  }

  async function remove(id:number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Pocket Tasks</h1>

      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="border rounded-lg px-3 py-2 flex items-center gap-3">
            <input
              type="checkbox"
              checked={t.done}
              onChange={e => toggle(t.id, e.target.checked)}
            />
            <span className={`flex-1 ${t.done ? "line-through text-gray-500" : ""}`}>
              {t.title}
            </span>
            <button onClick={() => remove(t.id)} className="text-sm text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
