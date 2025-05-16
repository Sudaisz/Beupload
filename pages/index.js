import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLink(data.url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">beupload</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={uploadFile}
        className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {link && (
        <div className="mt-6">
          <p>Download Link:</p>
          <a href={link} className="text-blue-300 underline">{link}</a>
        </div>
      )}
    </div>
  );
}
