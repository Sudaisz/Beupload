import formidable from 'formidable';
import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ uploadDir: './public/uploads', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' });

    const file = files.file[0];
    const shortId = nanoid(6);
    const newPath = `./public/uploads/${shortId}-${file.originalFilename}`;
    fs.renameSync(file.filepath, newPath);

    const metadata = {
      id: shortId,
      name: file.originalFilename,
      path: newPath,
      size: file.size
    };

    const dbPath = path.resolve('./data.json');
    const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {};
    db[shortId] = metadata;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
    const message = `
📤 *New Upload!*
*Filename:* ${file.originalFilename}
*Size:* ${fileSize} MB
*Link:* https://beupload.vercel.app/d/${shortId}
    `;

    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    res.status(200).json({ url: `/d/${shortId}` });
  });
}
