import { measureBlockHeight } from "./measureBlockHeight";

export const splitTextBlock = (
  block: string,
  remainingLines: number,
  containerDimensions: { width: number; height: number },
): [string, string] => {
  const totalLines = measureBlockHeight(block, containerDimensions);
  // If the block fits entirely in the remaining space, return it as is
  if (remainingLines >= totalLines) {
    return [block, ""];
  }

  // Check if the block is already wrapped in a <p> tag
  const paragraphMatch = block.match(/^<p([^>]*)>(.*)<\/p>$/); // Match <p> with attributes and content
  const isParagraph = !!paragraphMatch; // Check if it's a paragraph
  const attributes = isParagraph ? paragraphMatch[1] : ""; // Extract attributes from <p> tag
  const content = isParagraph ? paragraphMatch[2] : block; // Extract content inside <p> tags

  const words = content.split(/\s+/); // Split the content into words
  let part1 = ""; // Text that fits within the remaining lines
  let tempBlock = ""; // Temporary text for measuring
  let currentLines = 0;

  // Iterate through words to find the split point
  for (let i = 0; i < words.length; i++) {
    tempBlock += (i > 0 ? " " : "") + words[i]; // Add the current word
    const tempLines = measureBlockHeight(tempBlock, containerDimensions);

    if (tempLines > remainingLines) {
      break; // Stop when adding another word exceeds the remaining lines
    }

    part1 = tempBlock; // Update the fitting portion
    currentLines = tempLines; // Update the current line count
  }

  const part2 = words.slice(part1.split(/\s+/).length).join(" ").trim(); // Remaining text

  // Wrap the parts in <p> tags only if the original block was a paragraph
  const wrappedPart1 = isParagraph
    ? `<p${attributes ? ` ${attributes}` : ""}>${part1.trim()}</p>`
    : part1.trim();
  const wrappedPart2 = isParagraph
    ? `<p${attributes ? ` ${attributes}` : ""}>${part2.trim()}</p>`
    : part2.trim();

  return [wrappedPart1, wrappedPart2];
};
