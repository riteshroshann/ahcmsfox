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

    content = content.replace(/\.STUDENT_PROFILE/g, '.student_profile');
    content = content.replace(/\.COMPLAINT_CATEGORY/g, '.complaint_category');
    content = content.replace(/\.ROOM/g, '.room');
    content = content.replace(/\.ALLOCATION/g, '.allocation');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed object properties:', filePath);
    }
  }
});
