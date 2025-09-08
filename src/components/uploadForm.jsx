"use client";
import { useState } from "react";

export default function UploadForm({ vendorId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/vendor/${vendorId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Upload successful!");
    } else {
      setMessage("❌ Upload failed: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Upload
      </button>
      <p>{message}</p>
    </form>
  );
}
