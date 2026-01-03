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

console.log("Starting import refactor for admin features...");
const files = getAllFiles(srcDir);

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf8");
    let originalContent = content;

    // Actions
    content = content.replace(
      /@\/features\/admin\/actions\/apps/g,
      "@/features/apps/actions/apps"
    );
    content = content.replace(
      /@\/features\/surveys\/actions\/questions/g,
      "@/features/questions/actions/questions"
    );

    // Components
    // app
    content = content.replace(
      /@\/features\/admin\/components\/app/g,
      "@/features/apps/components"
    );
    // question
    content = content.replace(
      /@\/features\/admin\/components\/question/g,
      "@/features/questions/components"
    );
    // survey (management)
    content = content.replace(
      /@\/features\/admin\/components\/survey/g,
      "@/features/surveys/components/management"
    );

    if (content !== originalContent) {
      console.log(`Updating ${file}`);
      fs.writeFileSync(file, content, "utf8");
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
});
console.log("Done.");
