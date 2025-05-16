import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ params }) {
  const { id } = params;
  const dbPath = path.resolve('./data.json');
  const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};
  const fileData = db[id];

  if (!fileData) {
    return { notFound: true };
  }

  return {
    props: {
      file: {
        name: fileData.name,
        url: `/uploads/${id}-${fileData.name}`,
      },
    },
  };
}

export default function Download({ file }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Your File is Ready</h1>
      <a
        href={file.url}
        download
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Download {file.name}
      </a>
    </div>
  );
}
