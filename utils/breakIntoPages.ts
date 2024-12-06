const MEDIA_HEIGHT = 191; // Media blocks 165 + 16 + 10
const LINE_HEIGHT = 24; // Line height in pixels
const AFTER_TEXT_LINE = 2; // Extra lines after text blocks
const AFTER_MEDIA_LINE = 1; // Extra lines after media blocks

import { measureBlockHeight } from "./measureBlockHeight";
import { splitTextBlock } from "./splitTextBlock";

export const breakIntoPages = (
  htmlContent: string,
  containerDimensions: { width: number; height: number },
) => {
  const maxLines = Math.floor(containerDimensions.height / LINE_HEIGHT);
  // const mediaLines = Math.ceil(MEDIA_HEIGHT / LINE_HEIGHT);
  const mediaLines = Math.floor(MEDIA_HEIGHT / LINE_HEIGHT);

  const blocks = htmlContent.match(
    /<p.*?data-uuid="(.*?)".*?data-page-uuid="(.*?)".*?>(.*?)<\/p>|<img[^>]+>|<video[^>]+><\/video>/g,
  );

  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentLines = 0;

  const wrapWithTagIfNeeded = (content: string, tag: string): string => {
    const regex = new RegExp(`^<${tag}.*?>.*?<\\/${tag}>$`);
    return regex.test(content) ? content : `<${tag}>${content}</${tag}>`;
  };

  blocks?.forEach((block) => {
    if (block === "<p></p>") {
      return; // Skip empty paragraphs
    }
    const blockLines = measureBlockHeight(block, containerDimensions);

    const isMediaBlock =
      block.startsWith("<img") || block.startsWith("<video>");

    if (isMediaBlock) {
      // Media blocks are treated as 3 lines
      // After add media need add more 1 line
      if (currentLines + mediaLines + AFTER_MEDIA_LINE > maxLines) {
        // Move media to the next page if it doesn't fit
        pages.push([...currentPage]);
        currentPage = [block];
        currentLines = mediaLines;
      } else {
        // Add media to the current page
        currentPage.push(block);
        currentLines += mediaLines + AFTER_MEDIA_LINE;
      }
      return;
    }

    if (blockLines > maxLines) {
      // Split oversized blocks
      while (blockLines > 0) {
        const remainingLines = maxLines - currentLines;

        if (remainingLines > 0) {
          const [part1, part2] = splitTextBlock(
            block,
            remainingLines,
            containerDimensions,
          );

          if (part1) {
            currentPage.push(wrapWithTagIfNeeded(part1, "p"));
            currentLines += remainingLines;
            pages.push([...currentPage]);
          }

          currentPage = [];
          currentLines = 0;

          if (part2) {
            block = part2; // Continue splitting the remaining part
          } else {
            break; // No more to split
          }
        } else {
          pages.push([...currentPage]);
          currentPage = [];
          currentLines = 0;
        }
      }
    } else if (currentLines + blockLines + AFTER_TEXT_LINE <= maxLines) {
      // Add block if it fits, and account for 3 extra lines
      currentPage.push(block);
      currentLines += blockLines + AFTER_TEXT_LINE;
    } else {
      // Move block to the next page if it doesn't fit
      const remainingLines = maxLines - currentLines;
      if (remainingLines > 0) {
        const [part1, part2] = splitTextBlock(
          block,
          remainingLines,
          containerDimensions,
        );

        if (part1) {
          currentPage.push(wrapWithTagIfNeeded(part1, "p"));
          currentLines += remainingLines;
          pages.push([...currentPage]);
        }

        currentPage = [];
        currentLines = 0;

        if (part2) {
          currentPage.push(wrapWithTagIfNeeded(part2, "p"));
          currentLines = measureBlockHeight(part2, containerDimensions);
        }
      } else {
        pages.push([...currentPage]);
        currentPage = [block];
        currentLines = blockLines + AFTER_TEXT_LINE;
      }
    }
  });

  if (currentPage.length > 0) {
    pages.push([...currentPage]);
  }

  return pages;
};
