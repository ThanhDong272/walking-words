const FONT_SIZE = 14;
const LINE_HEIGHT = 24; // Line height in pixels
const CHAR_WIDTH_RATIO = 0.425555555; // Average width of a character as a fraction of font size
const LINE_HEIGHT_RATIO = 1.2; // Line height as a fraction of font size

export const measureBlockHeight = (
  html: string,
  containerDimensions: {
    width: number;
    height: number;
  },
) => {
  if (html.trim() === "") {
    return 0;
  }
  // Constants
  const charWidth = FONT_SIZE * CHAR_WIDTH_RATIO; // Average width of a character in pixels
  const charsPerLine = Math.floor(containerDimensions.width / charWidth) - 8; // Dynamic chars per line
  // Remove HTML tags and calculate text content
  const plainText = html.replace(/<[^>]*>/g, "").trim(); // Strip HTML tags
  const words = plainText.split(/\s+/); // Split by spaces or newlines

  // Calculate lines based on word wrapping
  let currentLine = 0;
  let currentLineChars = 0;

  words.forEach((word) => {
    if (currentLineChars + word.length + 1 <= charsPerLine) {
      // Add word to the current line (+1 for the space)
      currentLineChars += word.length + 1;
    } else {
      // Move to the next line
      currentLine += 1;
      currentLineChars = word.length; // Start with the new word
    }
  });

  // Count the last line if there's any leftover
  if (currentLineChars > 0) {
    currentLine += 1;
  }

  return currentLine;
};
