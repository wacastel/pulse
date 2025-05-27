// generatePlaylist.js
const fs = require("fs");
const path = require("path");

const songsRoot = path.join(__dirname, "songs");
const playlist = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".mp3")) {
      const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, "/");
      playlist.push(relativePath);
    }
  }
}

scan(songsRoot);

// Save playlist.json
fs.writeFileSync("playlist.json", JSON.stringify(playlist, null, 2));
console.log("Generated playlist.json with", playlist.length, "songs.");
