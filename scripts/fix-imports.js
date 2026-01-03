const fs = require("fs");
const path = require("path");

const srcDir = path.join(process.cwd(), "src");

function getAllFiles(dirPath, arrayOfFiles) {
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    console.error("Error reading dir:", dirPath, e);
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
    } catch (e) {
      console.error("Error stating file:", fullPath, e);
    }
  });

  return arrayOfFiles;
}

console.log("Starting import fix...");
const files = getAllFiles(srcDir);
console.log(`Found ${files.length} files.`);

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf8");
    let originalContent = content;

    // Replacements
    // Actions
    content = content
      .split("@/app/actions/surveys")
      .join("@/features/surveys/actions/surveys");
    content = content
      .split("@/app/actions/questions")
      .join("@/features/surveys/actions/questions");
    content = content
      .split("@/app/actions/submission")
      .join("@/features/surveys/actions/submission");
    content = content
      .split("@/app/actions/users")
      .join("@/features/users/actions/users");
    content = content
      .split("@/app/actions/auth")
      .join("@/features/auth/actions/auth");
    content = content
      .split("@/app/actions/apps")
      .join("@/features/admin/actions/apps");

    // Components
    content = content
      .split("@/components/survey")
      .join("@/features/surveys/components");
    content = content
      .split("@/components/admin")
      .join("@/features/admin/components");

    // Auth root
    // Handle variants of quotes if needed, but split/join is strict.
    // Use regex for quotes flexibility if desired, but split is safer for syntax errors.
    content = content.replace(/from "@/g, 'from "@/'); // no-op but consistency?

    // Specific fix for auth imports
    // import { ... } from "@/lib/auth/auth"
    content = content.replace(
      /from\s+['"]@\/auth['"]/g,
      'from "@/lib/auth/auth"'
    );
    content = content.replace(
      /from\s+['"]@\/auth\.config['"]/g,
      'from "@/lib/auth/auth.config"'
    );

    if (content !== originalContent) {
      console.log(`Updating imports in ${file}`);
      fs.writeFileSync(file, content, "utf8");
    }
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
});
console.log("Done.");
