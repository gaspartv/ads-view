const fs = require('fs');
const path = require('path');

const directoryPath = '/root/projects/ads/view/app/admin/dashboard';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Green to Primary
    content = content.replace(/bg-green-100 text-green-800 dark:bg-green-900\/30 dark:text-green-400/g, 'bg-primary/10 text-primary dark:bg-primary/20');
    content = content.replace(/text-green-[56]00(?: dark:text-green-400)?/g, 'text-primary');
    content = content.replace(/bg-green-500/g, 'bg-primary');

    // Red to Destructive
    content = content.replace(/bg-red-100 text-red-800 dark:bg-red-900\/30 dark:text-red-400/g, 'bg-destructive/10 text-destructive dark:bg-destructive/20');
    content = content.replace(/text-red-[56]00(?: dark:text-red-400)?/g, 'text-destructive');
    content = content.replace(/bg-red-500/g, 'bg-destructive');

    // Amber/Orange to Secondary/Accent
    content = content.replace(/bg-amber-100 text-amber-800 dark:bg-amber-900\/30 dark:text-amber-400/g, 'bg-secondary text-secondary-foreground');
    content = content.replace(/text-amber-[56]00(?: dark:text-amber-400)?/g, 'text-secondary-foreground');
    content = content.replace(/border-amber-200/g, 'border-secondary');
    content = content.replace(/text-orange-500/g, 'text-secondary-foreground');
    content = content.replace(/bg-amber-500\/5 dark:bg-amber-500\/10 shadow-\[inset_4px_0_0_0_rgba\(251,191,36,0\.5\)\]/g, 'bg-primary/5 dark:bg-primary/10 shadow-[inset_4px_0_0_0_var(--primary)]');

    // Blue to Primary
    content = content.replace(/text-blue-[56]00(?: dark:text-blue-400)?/g, 'text-primary');
    content = content.replace(/border-blue-200/g, 'border-primary/30');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
