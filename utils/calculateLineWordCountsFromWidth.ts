const CHAR_WIDTH_RATIO = 0.425555555; // Average width of a character as a fraction of font size

export const calculateLineWordCountsFromWidth = (
  text: string,
  containerWidth: number,
  fontSize: number,
) => {
  const averageCharWidth = fontSize * CHAR_WIDTH_RATIO;
  const words = text.split(" ");

  const lineWordCounts = [];
  let currentLineWidth = 0;
  let wordsInLine = 0;

  words.forEach((word: string) => {
    // Calculate the width of the word
    const wordWidth = word.length * averageCharWidth + averageCharWidth; // Add space width

    if (currentLineWidth + wordWidth > containerWidth) {
      // If current line width exceeds container, start a new line
      lineWordCounts.push(wordsInLine);
      currentLineWidth = wordWidth;
      wordsInLine = 1;
    } else {
      // Add word to the current line
      currentLineWidth += wordWidth;
      wordsInLine++;
    }
  });

  // Add the last line if there are remaining words
  if (wordsInLine > 0) {
    lineWordCounts.push(wordsInLine);
  }

  return lineWordCounts;
};
