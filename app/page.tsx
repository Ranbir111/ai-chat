"use client"
import { useState } from "react";

export default function Home() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      setResponse(data.response);
      setMessage("");
      setLoading(false);

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }

  const handleStreamChat = async () => {
    setStreaming(true);
    setStreamResponse("");

    try {
      const res = await fetch("/api/chatstream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value }: any = await reader?.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStreamResponse((prev) => prev + data.text);
          }
        }
      }
      setMessage("");
      setStreaming(false);
    } catch (error) {
      console.error("Error:", error);
      setStreaming(false);
    }
  }

  return (
    <div className="p-4 w-full">
      <div className="w-full">
        <textarea className="w-full border border-gray-300 p-2 rounded" placeholder="Type your message here..." rows={4} name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button onClick={handleChat} className="cursor-pointer p-2 border-2 border-gray-300 rounded">{loading ? "Loading..." : "Chat"}</button>
        <button onClick={handleStreamChat} className="cursor-pointer p-2 border-2 border-gray-300 rounded">{streaming ? "Streaming..." : "Stream chat"}</button>
      </div>

      <div className="border-2 border-gray-300 rounded p-4 mt-4 min-h-[100px]">
        <h4 className="font-bold">Chat response</h4>
        {response && <p className="mt-4">{response}</p>}
      </div>
      <div className="border-2 border-gray-300 rounded p-4 mt-4 min-h-[100px]">
        <h4 className="font-bold">Stream Chat response</h4>
        {streamResponse && <p className="mt-4">{streamResponse}</p>}
      </div>
    </div>
  );
}
