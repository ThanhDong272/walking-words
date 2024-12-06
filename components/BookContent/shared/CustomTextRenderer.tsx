import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  CustomRendererProps,
  TPhrasing,
  TText,
} from "react-native-render-html";
import { useQueryClient } from "@tanstack/react-query";
import { SelectableText } from "@thanhdong272/react-native-selectable-text";
import { router } from "expo-router";

import { useGetBooksPage, useMarkPageText } from "@generated/books/books";
import { BOOK_READER_THEME } from "@constants";
import { EQueryUser } from "@constants/queries";

import DefaultTheme from "@theme";

interface CustomTextRendererProps
  extends CustomRendererProps<TText | TPhrasing> {
  bookUUID: string;
  index: number;
  pageUUID: string;
  contentUUID: string;
  pageNumber: number;
  theme: BOOK_READER_THEME;
  rawContent: string;
}

const CustomTextRenderer = (props: CustomTextRendererProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    TDefaultRenderer,
    bookUUID,
    pageUUID,
    contentUUID,
    pageNumber,
    rawContent,
  } = props;
  const [updatedContent, setUpdatedContent] = useState(rawContent);

  const bookmarkText = useMarkPageText();

  const [menuSelectableText, setMenuSelectableText] = useState([
    t("action.save_bookmark_as"),
    t("action.location"),
  ]);

  const [markedRanges, setMarkedRanges] = useState<
    { start: number; end: number }[]
  >([]);

  const isRangeMarked = (
    start: number,
    end: number,
    content: string,
  ): boolean => {
    const marks = Array.from(content.matchAll(/<mark>(.*?)<\/mark>/g));
    return marks.some(([_, markedText]) => {
      const markedStart = content.indexOf(markedText);
      const markedEnd = markedStart + markedText.length;
      return start >= markedStart && end <= markedEnd;
    });
  };

  const findMarkRange = (
    start: number,
    end: number,
    content: string,
  ): { start: number; end: number } => {
    const marks = Array.from(content.matchAll(/<mark>(.*?)<\/mark>/g));
    for (const [_, markedText] of marks) {
      const markedStart = content.indexOf(markedText);
      const markedEnd = markedStart + markedText.length;
      if (start >= markedStart && end <= markedEnd) {
        return { start: markedStart, end: markedEnd };
      }
    }
    return { start, end };
  };

  // Utility function to add <mark> tags to a range in content
  const addMark = (content: string, start: number, end: number): string => {
    return (
      content.slice(0, start) +
      "<mark>" +
      content.slice(start, end) +
      "</mark>" +
      content.slice(end)
    );
  };

  // Utility function to remove <mark> tags from a range in content
  const removeMark = (content: string, start: number, end: number): string => {
    return content.replace(/<mark>(.*?)<\/mark>/g, (_, markedText) => {
      const markedStart = content.indexOf(markedText);
      const markedEnd = markedStart + markedText.length;
      if (start >= markedStart && end <= markedEnd) {
        return markedText; // Return unmarked text
      }
      return `<mark>${markedText}</mark>`;
    });
  };

  // Function to check if a range overlaps with any existing marks
  const findOverlappingMarks = (start: number, end: number) => {
    const markRegex = /<mark>(.*?)<\/mark>/g;
    let match;
    const overlappingMarks = [];

    while ((match = markRegex.exec(updatedContent)) !== null) {
      const markStart = match.index;
      const markEnd = markStart + match[0].length;
      const textLength = match[1].length;

      // Check if this mark overlaps with the selection
      if (!(end <= markStart || start >= markEnd)) {
        overlappingMarks.push({
          start: markStart,
          end: markEnd,
          text: match[1],
          fullMatch: match[0],
        });
      }
    }
    return overlappingMarks;
  };

  // Function to remove mark tags from a specific range
  const removeMarkFromRange = (start: number, end: number) => {
    const overlappingMarks = findOverlappingMarks(start, end);
    let newContent = updatedContent;

    // Remove marks in reverse order to maintain correct indices
    for (let i = overlappingMarks.length - 1; i >= 0; i--) {
      const mark = overlappingMarks[i];
      newContent =
        newContent.slice(0, mark.start) +
        mark.text +
        newContent.slice(mark.end);
    }

    return newContent;
  };

  // Utility function to remove a marked range
  const removeMarkedRange = (start: number, end: number) => {
    setMarkedRanges(
      markedRanges.filter(
        (range) => range.start !== start || range.end !== end,
      ),
    );
  };

  // Utility function to add a marked range
  const addMarkedRange = (start: number, end: number) => {
    setMarkedRanges([...markedRanges, { start, end }]);
  };

  // Remove all HTML tags from raw content
  const sanitizeContent = (content: string) =>
    content.replace(/<\/?[^>]+(>|$)/g, "");

  // Function to parse existing <mark> tags in rawContent and return marked ranges
  const parseMarkedRanges = (content: string) => {
    const ranges: { start: number; end: number }[] = [];
    let contentWithoutTags = "";
    let offset = 0; // Tracks the position within the original content

    // Regex to match <mark> tags
    const regex = /<mark>(.*?)<\/mark>/g;
    let match;

    // Loop through all <mark> matches
    while ((match = regex.exec(content)) !== null) {
      const markedText = match[1];
      const start = contentWithoutTags.length;
      const end = start + markedText.length;

      // Push start and end positions into ranges
      ranges.push({ start, end });

      // Append text without tags to contentWithoutTags
      contentWithoutTags += content.slice(offset, match.index) + markedText;
      offset = regex.lastIndex; // Update offset to the end of the matched <mark> tag
    }

    // Append any remaining text after the last <mark> tag
    contentWithoutTags += content.slice(offset);

    return { ranges, contentWithoutTags };
  };

  // New function to check if a selection is within a marked range
  const isSelectionInMarkedRange = (
    selectionStart: number,
    selectionEnd: number,
    ranges: { start: number; end: number }[],
  ) => {
    for (const range of ranges) {
      if (selectionStart >= range.start && selectionEnd <= range.end) {
        return true; // The selection is entirely within a marked range
      }
    }
    return false;
  };

  useEffect(() => {
    // Only parse and set initial ranges if there's rawContent
    if (rawContent) {
      const { ranges, contentWithoutTags } = parseMarkedRanges(rawContent);
      setMarkedRanges(ranges);
    }
  }, [rawContent]);

  // Adjust selection start and end positions in raw content to wrap <mark> tags
  const applyMarkInRawContent = (
    content: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
    const sanitizedContent = sanitizeContent(content);

    // Count characters while accounting for tag lengths
    let adjustedStart = selectionStart;
    let adjustedEnd = selectionEnd;
    let tagOffset = 0;

    // Loop to adjust for HTML tags in original content
    for (let i = 0; i < content.length; i++) {
      if (content[i] === "<") {
        // Skip tag content until ">"
        while (content[i] !== ">" && i < content.length) {
          i++;
          tagOffset++;
        }
      } else if (i - tagOffset < selectionStart) {
        adjustedStart++;
      } else if (i - tagOffset < selectionEnd) {
        adjustedEnd++;
      }
    }

    // Insert <mark> tags at adjusted positions in raw content
    return (
      content.slice(0, adjustedStart) +
      "<mark>" +
      content.slice(adjustedStart, adjustedEnd) +
      "</mark>" +
      content.slice(adjustedEnd)
    );
  };

  const mapPositionsToRawContent = (_rawContent: string) => {
    const sanitizedContent = [];
    const positionMap = []; // Maps each character's index in sanitizedContent to its position in rawContent

    let insideTag = false;
    for (let i = 0, j = 0; i < _rawContent.length; i++) {
      if (_rawContent[i] === "<") {
        insideTag = true;
      }

      if (!insideTag) {
        sanitizedContent.push(_rawContent[i]);
        positionMap.push(i); // Store the original index in rawContent
      }

      if (_rawContent[i] === ">") {
        insideTag = false;
      }
    }

    return {
      sanitizedContent: sanitizedContent.join(""),
      positionMap,
    };
  };

  const mapSelectionToRawContent = (
    selectionStart: number,
    selectionEnd: number,
    positionMap: any,
  ) => {
    // Map cleaned content selection back to rawContent
    const rawStart = positionMap[selectionStart];
    const rawEnd = positionMap[selectionEnd];
    return { rawStart, rawEnd };
  };

  const handleBookmarkText = async (content: string) => {
    try {
      const { success } = await bookmarkText.mutateAsync({
        data: {
          pageUuid: pageUUID,
          contentUuid: contentUUID,
          text: content,
        },
      });
      if (success) {
        queryClient.invalidateQueries({ queryKey: [EQueryUser.BOOK_PAGES] });
      }
    } catch (error) {
      console.log("Error on bookmark: ", error);
    }
  };

  const handleSelection = ({
    eventType,
    content,
    selectionStart,
    selectionEnd,
  }: {
    eventType: string;
    content: string;
    selectionStart: number;
    selectionEnd: number;
  }) => {
    console.log(
      "handleSelection",
      eventType,
      content,
      selectionStart,
      selectionEnd,
    );

    if (eventType === t("action.save_bookmark_as")) {
      // Update the options for the next selection
      setMenuSelectableText([t("action.text"), t("action.audio")]);
    } else if (eventType === t("action.text")) {
      // Step 1: Map cleaned positions to raw content positions
      const { sanitizedContent, positionMap } =
        mapPositionsToRawContent(updatedContent);
      const { rawStart, rawEnd } = mapSelectionToRawContent(
        selectionStart,
        selectionEnd,
        positionMap,
      );

      // Check if the selected range overlaps with any existing marks
      const overlappingMarks = findOverlappingMarks(rawStart, rawEnd);

      let newContent = updatedContent;

      if (overlappingMarks.length > 0) {
        // If there are overlapping marks, remove them
        newContent = removeMarkFromRange(rawStart, rawEnd);
        handleBookmarkText(newContent);
      } else {
        // If no overlapping marks, add a new mark
        newContent = addMark(newContent, rawStart, rawEnd);
        handleBookmarkText(newContent);
      }
    } else if (eventType === t("action.audio")) {
      //TODO: Handle audio action
      console.log("handle audio");
    } else if (eventType === t("action.location")) {
      router.push({
        pathname: "/(screens)/story_overview",
        params: { uuid: pageUUID },
      });
    }
  };

  const textStyle = {
    lineHeight: 28,
    whiteSpace: "pre-wrap",
    fontSize: 14,
    fontFamily: DefaultTheme.fonts.metropolis.regular,
    color:
      props.theme === BOOK_READER_THEME.DARK
        ? DefaultTheme.colors.white
        : DefaultTheme.colors.black,
  };

  return (
    <SelectableText
      key={props.index}
      value={""}
      textComponentProps={{}}
      menuItems={menuSelectableText}
      menuItemsExtend={[t("action.text"), t("action.audio")]}
      highlightColor={DefaultTheme.colors.black}
      prependToChild={
        <TDefaultRenderer key={props.index} {...props} style={textStyle} />
      }
      onSelection={handleSelection}
    />
  );
};

export default memo(CustomTextRenderer);
