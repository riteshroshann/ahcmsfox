const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:\\Users\\rites\\Desktop\\ahcms\\src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix .from("TABLE") -> .from("table")
    content = content.replace(/\.from\(\s*["']([A-Z_]+)["']\s*\)/g, (match, p1) => {
      return `.from("${p1.toLowerCase()}")`;
    });

    // Fix inner queries like "*, ROOM(...)" -> "*, room(...)"
    // Replace all uppercase words followed by parenthesis inside .select() strings
    content = content.replace(/\.select\(\s*["']([^"']+)["']\s*\)/g, (match, p1) => {
      let lowerSelect = p1.replace(/([A-Z_]+)(?=\()/g, (m) => m.toLowerCase());
      // Also catch ALLOCATION!inner -> allocation!inner
      lowerSelect = lowerSelect.replace(/([A-Z_]+)(?=!)/g, (m) => m.toLowerCase());
      return `.select("${lowerSelect}")`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
