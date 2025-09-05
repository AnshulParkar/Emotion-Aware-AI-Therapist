import React, { useState } from "react";
import type { Thread } from "../types";

type Props = {
  threads: Thread[];
  activeChannel: string;
  activeThread: Thread | null;
  setActiveThread: (t: Thread) => void;
  addThread: (title: string) => void;
};

export default function ThreadList({ threads, activeChannel, activeThread, setActiveThread, addThread }: Props) {
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const channelThreads = threads.filter((t) => t.channel === activeChannel);

  return (
    <div className="w-1/4 p-4 border-r">
      <h2 className="font-bold mb-2">{activeChannel} Threads</h2>
      {channelThreads.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveThread(t)}
          className={`block w-full text-left p-2 rounded mb-1 ${
            activeThread?.id === t.id ? "bg-blue-100" : "bg-gray-50"
          }`}
        >
          {t.title} ({t.posts.length})
        </button>
      ))}

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          placeholder="New thread title..."
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={() => {
            addThread(newThreadTitle);
            setNewThreadTitle("");
          }}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
