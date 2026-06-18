const fs = require('fs');
const path = require('path');

function removeUppercaseFromParagraphs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('admin')) continue;
    if (fs.statSync(fullPath).isDirectory()) {
      removeUppercaseFromParagraphs(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Regex to find uppercase inside <p className="..."> or <span className="..."> where it looks like paragraph text
      // Instead of complex parsing, let's just replace ' uppercase' with '' on lines that contain '<p '
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<p ') && lines[i].includes('uppercase')) {
          lines[i] = lines[i].replace(/\buppercase\b/g, '').replace(/  +/g, ' ');
          changed = true;
        }
        // Also remove from descriptions in PostCard or other text-slate/text-black things
        // E.g., <p className="text-slate-700 font-bold ... uppercase ...">
      }
      content = lines.join('\n');

      // Check PostCard.tsx specifically
      if (fullPath.includes('PostCard.tsx')) {
        content = content.replace(/\buppercase\b/g, function (match, offset, string) {
          // If it's on the line with line-clamp-3, remove it
          const lineStart = string.lastIndexOf('\n', offset);
          const lineEnd = string.indexOf('\n', offset);
          const line = string.substring(lineStart, lineEnd);
          if (line.includes('line-clamp-3') || line.includes('flex-1')) {
            changed = true;
            return '';
          }
          return match;
        });
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed:', fullPath);
      }
    }
  }
}

removeUppercaseFromParagraphs(path.join(__dirname, 'src', 'app'));
removeUppercaseFromParagraphs(path.join(__dirname, 'src', 'components'));
