import React, { useState } from "react";
import type { Thread, Post } from "./types";
import ChannelList from "./components/channel_list";
import ThreadList from "./components/thread_list";
import ThreadView from "./components/thread_view";

const channels = ["General", "Stress", "Academics"];

export default function PeerSupport() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeChannel, setActiveChannel] = useState("General");
  const [activeThread, setActiveThread] = useState<Thread | null>(null);

  const randomHandle = () =>
    "User" + Math.floor(Math.random() * 1000).toString();

  const addThread = (title: string) => {
    if (!title.trim()) return;
    const newThread: Thread = {
      id: Date.now(),
      channel: activeChannel,
      title,
      posts: [],
    };
    setThreads([...threads, newThread]);
  };

  const addPost = (content: string) => {
    if (!activeThread || !content.trim()) return;
    const newEntry: Post = {
      id: Date.now(),
      author: randomHandle(),
      content,
      reported: false,
    };
    const updatedThreads = threads.map((t) =>
      t.id === activeThread.id
        ? { ...t, posts: [...t.posts, newEntry] }
        : t
    );
    setThreads(updatedThreads);
    setActiveThread({
      ...activeThread,
      posts: [...activeThread.posts, newEntry],
    });
  };

  const reportPost = (postId: number) => {
    if (!activeThread) return;
    const updatedThreads = threads.map((t) =>
      t.id === activeThread.id
        ? {
            ...t,
            posts: t.posts.map((p) =>
              p.id === postId ? { ...p, reported: true } : p
            ),
          }
        : t
    );
    setThreads(updatedThreads);
    setActiveThread({
      ...activeThread,
      posts: activeThread.posts.map((p) =>
        p.id === postId ? { ...p, reported: true } : p
      ),
    });
  };

  return (
    <div className="flex h-screen">
      <ChannelList
        channels={channels}
        activeChannel={activeChannel}
        setActiveChannel={(ch) => {
          setActiveChannel(ch);
          setActiveThread(null);
        }}
      />
      <ThreadList
        threads={threads}
        activeChannel={activeChannel}
        activeThread={activeThread}
        setActiveThread={setActiveThread}
        addThread={addThread}
      />
      <ThreadView
        thread={activeThread}
        addPost={addPost}
        reportPost={reportPost}
      />
    </div>
  );
}
