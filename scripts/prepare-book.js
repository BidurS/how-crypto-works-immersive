import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('../.book_content/Chapters');
const DEST_DIR = path.resolve('./public/chapters');
const DATA_FILE = path.resolve('./src/chapters.json');

// Ensure destination directories exist
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const chaptersData = [];

// Read all markdown files from the source directory
const files = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.md'));

// Order based on the provided list or filename sorting
// _preface.md, ch01, etc.
files.sort((a, b) => {
  if (a === '_preface.md') return -1;
  if (b === '_preface.md') return 1;
  return a.localeCompare(b);
});

files.forEach((file, index) => {
  const filePath = path.join(SRC_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract title from the first heading line
  let title = `Chapter ${index}`;
  const firstLineMatch = content.match(/^#\s+(.+)$/m);
  if (firstLineMatch) {
    title = firstLineMatch[1].trim();
  } else {
      // fallback
      title = file.replace('.md', '').replace(/_/g, ' ');
  }

  // Generate a URL-friendly slug
  const slug = file === '_preface.md' ? 'preface' : file.replace('.md', '').replace(/^ch\d+_/, '');

  // Copy the file to the public directory
  const destFilePath = path.join(DEST_DIR, file);
  fs.writeFileSync(destFilePath, content);

  chaptersData.push({
    id: `chapter-${index}`,
    slug,
    title,
    filename: file,
    path: `/chapters/${file}`
  });
});

fs.writeFileSync(DATA_FILE, JSON.stringify(chaptersData, null, 2));
console.log(`Successfully processed ${files.length} chapters.`);
