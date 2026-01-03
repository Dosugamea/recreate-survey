const fs = require("fs");
const path = require("path");

const srcDir = path.join(process.cwd(), "src");

function getAllFiles(dirPath, arrayOfFiles) {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return arrayOfFiles || [];
  }

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          arrayOfFiles.push(fullPath);
        }
      }
    } catch (e) {}
  });

  return arrayOfFiles;
}

console.log("Refactoring imports to features/admin/...");
const files = getAllFiles(srcDir);

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf8");
    let originalContent = content;

    // apps
    content = content.replace(/@\/features\/apps/g, "@/features/admin/apps");
    // questions
    content = content.replace(
      /@\/features\/questions/g,
      "@/features/admin/questions"
    );

    // surveys (admin components)
    // previously: @/features/surveys/components/management
    // now: @/features/admin/surveys/components
    content = content.replace(
      /@\/features\/surveys\/components\/management/g,
      "@/features/admin/surveys/components"
    );

    // surveys (admin actions)
    // previously: @/features/surveys/actions/surveys
    // now: @/features/admin/surveys/actions/surveys
    content = content.replace(
      /@\/features\/surveys\/actions\/surveys/g,
      "@/features/admin/surveys/actions/surveys"
    );

    // Make sure we didn't break public survey components/actions
    // Public actions like submission stay in @/features/surveys/actions/submission (no change needed if regex is specific)
    // We only moved 'surveys.ts'.

    if (content !== originalContent) {
      console.log(`Updating ${file}`);
      fs.writeFileSync(file, content, "utf8");
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
});
console.log("Done.");
