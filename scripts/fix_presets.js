const fs = require('fs');

const targetFile = '/root/projects/ads/view/app/admin/dashboard/company/theme/components/theme-editor.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// Regex to match individual presets within the PRESETS array.
// This is a bit tricky, let's use a simpler approach. We will evaluate PRESETS, update them, and stringify them back.
// Since the file has imports and React code, we'll extract the PRESETS array string, evaluate it, update it, and inject it back.

const presetsMatch = content.match(/const PRESETS:\s*Array<.*?>\s*=\s*(\[[\s\S]*?\]);\n\n\n\n\nconst THEME_VARIABLES/m);

if (!presetsMatch) {
  console.log("Could not find PRESETS array in file.");
  process.exit(1);
}

let presetsStr = presetsMatch[1];
// Some cleanup to make it eval-able if needed, or we can just parse it as JSON if it's strictly JSON-like.
// Since it's TS code with `oklch()`, we can use a naive JS execution or regex replacement.

function fixPalette(palette, basePalette) {
  // Use basePalette values or fallbacks if they exist
  if (!palette.muted && palette.secondary) palette.muted = palette.secondary;
  if (!palette.mutedForeground && palette.secondaryForeground) palette.mutedForeground = palette.secondaryForeground;
  if (!palette.border && palette.secondary) palette.border = palette.secondary;
  if (!palette.input && palette.border) palette.input = palette.border;
  if (!palette.ring && palette.primary) palette.ring = palette.primary;
  if (!palette.popover && palette.card) palette.popover = palette.card;
  if (!palette.popoverForeground && palette.cardForeground) palette.popoverForeground = palette.cardForeground;
  return palette;
}

// We will use eval to safely get the array, modify it, and convert back to string
// Wait, eval might fail if there are typescript types inside the array items.
// Luckily the PRESETS array items are pure JS objects.
let presetsArray;
try {
  presetsArray = eval(presetsStr);
} catch (e) {
  console.log("Failed to eval PRESETS array:", e);
  process.exit(1);
}

presetsArray = presetsArray.map(preset => {
  if (preset.theme.light) {
    preset.theme.light = fixPalette(preset.theme.light, preset.theme.light);
  }
  if (preset.theme.dark) {
    preset.theme.dark = fixPalette(preset.theme.dark, preset.theme.dark);
  }
  return preset;
});

const newPresetsStr = JSON.stringify(presetsArray, null, 2);

content = content.replace(presetsMatch[1], newPresetsStr);
fs.writeFileSync(targetFile, content, 'utf8');
console.log("Successfully updated PRESETS in theme-editor.tsx");
