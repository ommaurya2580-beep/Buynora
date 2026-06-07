const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : 
      callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern 1: text-gray-900 dark:text-white or similar
    content = content.replace(/text-gray-\d{3}\s+dark:text-white/g, 'text-text-primary');
    content = content.replace(/text-gray-\d{3}\s+dark:text-gray-\d{3}/g, 'text-text-secondary');
    
    // Pattern 2: text-black dark:text-white
    content = content.replace(/text-black\s+dark:text-white/g, 'text-text-primary');

    // Pattern 3: bg-white dark:bg-slate-\d{3}
    content = content.replace(/bg-white\s+dark:bg-slate-\d{3}/g, 'bg-bg-surface');
    content = content.replace(/bg-gray-50\s+dark:bg-slate-\d{3}/g, 'bg-bg-secondary');

    // Pattern 4: text-white alone (if inside a colored bg, it should be text-text-inverted, but safely let's use text-text-inverted)
    content = content.replace(/\btext-white\b/g, 'text-text-inverted');
    content = content.replace(/\btext-black\b/g, 'text-text-primary');
    
    // Pattern 5: any remaining dark:text-white (since we replaced text-white with text-text-inverted)
    content = content.replace(/dark:text-text-inverted/g, 'dark:text-text-primary'); // cleanup if we accidentally created this
    
    // remove dark:text-xxx where they might be redundant now
    content = content.replace(/dark:text-text-primary/g, ''); 
    content = content.replace(/dark:text-text-secondary/g, '');

    // Any remaining text-gray-* that isn't handled? 
    // We can't safely replace ALL text-gray-* because they might be specific. But if they are just colors, we could map them.

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
