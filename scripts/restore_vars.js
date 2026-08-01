const fs = require('fs');

const THEME_VARS_ARRAY = require('../THEME_VARS_ARRAY.json');

const targetFile = '/root/projects/ads/view/app/admin/dashboard/company/theme/components/theme-editor.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// The regex might have eaten THEME_VARIABLES. We will just append it back before ThemeEditor function.
if (!content.includes('const THEME_VARIABLES =')) {
  const varsArrayCode = `\nconst THEME_VARIABLES = ${JSON.stringify(THEME_VARS_ARRAY, null, 2)};\n`;
  content = content.replace(/export function ThemeEditor/, varsArrayCode + '\nexport function ThemeEditor');
  fs.writeFileSync(targetFile, content);
  console.log('Restored THEME_VARIABLES');
} else {
  console.log('THEME_VARIABLES still exists');
}
