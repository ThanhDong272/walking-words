//@ts-nocheck
//@ts-ignore
const fs = require("fs");

const assetsConfig = [
  {
    pathFolder: process.cwd() + "/assets/images",
    assetName: "images",
  },
];

const REGEX_EXTENSION_ASSET = /\.(svg|png|apng|jpg|jpeg|webp|json|rive|ttf)$/gm;

function capitalize(text) {
  const arraySplitString = text.trim().split(/[-_\s]/);

  return arraySplitString.reduce((pre, next) => {
    return pre + next.slice(0, 1).toUpperCase() + next.slice(1, next.length);
  }, "");
}

/// Duyệt các file asset
for (const assetConfig of assetsConfig) {
  const PATH_FOLDER = assetConfig.pathFolder;

  let stringifyImport = "";

  const filesName = fs.readdirSync(PATH_FOLDER);

  for (const index in filesName) {
    const file = filesName[index];

    /// ignore các file scale up @2x, @3x
    if (/@\dx/gm.test(file)) {
      continue;
    }

    /// validate các extension file support
    if (!REGEX_EXTENSION_ASSET.test(file)) {
      continue;
    }

    const newData = {
      path: file,
      name: capitalize(file.replace(REGEX_EXTENSION_ASSET, "")),
    };

    /// set record to export
    stringifyImport += `
  /** How it display
   *
   * ![${newData.name}](${assetConfig.pathFolder + "/" + newData.path})
   * */
  ${
    newData.name[0].toLowerCase() + newData.name.slice(1, newData.name.length)
  }: require("./${newData.path}"),`;
  }

  stringifyImport = `export const ${
    assetConfig.assetName
  } = {${stringifyImport}\n};

export type ${capitalize(
    [assetConfig.assetName, "type"].join(" "),
  )} = keyof typeof ${assetConfig.assetName};\n`;

  if (stringifyImport !== "") {
    fs.writeFileSync(PATH_FOLDER + "/index.ts", stringifyImport);
  }
}
