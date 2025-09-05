import React, { useState } from "react";
import type { Thread } from "../types";
import PostItem from "./post_item";

type Props = {
  thread: Thread | null;
  addPost: (content: string) => void;
  reportPost: (id: number) => void;
};

export default function ThreadView({ thread, addPost, reportPost }: Props) {
  const [newPost, setNewPost] = useState("");

  if (!thread) return <p className="p-4">Select a thread to view posts.</p>;

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-2">{thread.title}</h2>
      <div className="space-y-2 mb-4">
        {thread.posts.map((p) => (
          <PostItem key={p.id} post={p} reportPost={reportPost} />
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Write your reply..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={() => {
            addPost(newPost);
            setNewPost("");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
