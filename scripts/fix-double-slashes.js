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

console.log("Fixing double slashes...");
const files = getAllFiles(srcDir);

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf8");
    let originalContent = content;

    content = content.split("@//").join("@/");

    if (content !== originalContent) {
      console.log(`Fixing ${file}`);
      fs.writeFileSync(file, content, "utf8");
    }
  } catch (e) {
    console.error(e);
  }
});
console.log("Done.");
