import React from "react";
import type { Post } from "../types";

type Props = {
  post: Post;
  reportPost: (id: number) => void;
};

export default function PostItem({ post, reportPost }: Props) {
  return (
    <div
      className={`p-3 border rounded ${
        post.reported ? "bg-red-100" : "bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-500">{post.author}</p>
      <p>{post.content}</p>
      {!post.reported && (
        <button
          onClick={() => reportPost(post.id)}
          className="text-xs text-red-500 mt-1"
        >
          Report
        </button>
      )}
      {post.reported && (
        <p className="text-xs text-red-600">⚠ Reported</p>
      )}
    </div>
  );
}
