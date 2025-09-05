import React from "react";

type Props = {
  channels: string[];
  activeChannel: string;
  setActiveChannel: (ch: string) => void;
};

export default function ChannelList({ channels, activeChannel, setActiveChannel }: Props) {
  return (
    <div className="w-1/5 bg-gray-100 p-4 border-r">
      <h2 className="font-bold mb-2">Channels</h2>
      {channels.map((ch) => (
        <button
          key={ch}
          onClick={() => setActiveChannel(ch)}
          className={`block w-full text-left px-2 py-1 rounded mb-1 ${
            activeChannel === ch ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}
