const fs = require("fs");
const { update } = require("lodash");

const jsonFilePath = "components/Icon/selection.json";
const globalDtsFilePath = "global.d.ts";

fs.readFile(jsonFilePath, "utf-8", (err, data) => {
  if (err) {
    console.log("Error on read icomoon json file: ", err);
    return;
  }

  const jsonData = JSON.parse(data);
  const iconNames = jsonData.icons.map((iconData) => iconData.properties.name);
  const appIconType = `type AppIcon = ${iconNames.map((name) => `'${name}'`).join(" | ")};`;

  fs.readFile(globalDtsFilePath, "utf-8", (globalDtsErr, globalDtsData) => {
    if (globalDtsErr) {
      console.log("Error on read global.d.ts file: ", err);
      return;
    }

    const declareGlobalRegex = /declare\s+global\s*{[^;]*;/s;
    let updatedData = globalDtsData.trim();

    if (declareGlobalRegex.exec(globalDtsData)) {
      updatedData = globalDtsData.replace(declareGlobalRegex, () => {
        return `declare global {\n${appIconType}\n `;
      });
    } else {
      console.log("declare global types not found in global.d.ts file");
      return;
    }

    fs.writeFile(globalDtsFilePath, updatedData, (writeErr) => {
      if (writeErr) {
        console.log("Error on update global.d.ts file: ", writeErr);
      } else {
        console.log("✅ Updated app icon type");
      }
    });
  });
});
