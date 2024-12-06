import React, { memo, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import type {
  CustomRendererProps,
  InternalRendererProps,
  TBlock,
  TPhrasing,
  TText,
} from "react-native-render-html";
import RenderHtml, {
  defaultSystemFonts,
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import type * as Device from "expo-device";
import styled from "styled-components/native";

import type { ChapterPageContentItem } from "@generated/model";
import { screenWidth } from "@utils/common";
import { ALPHA_VALUE, BOOK_READER_THEME } from "@constants";

import type { BookPage } from "..";

import CustomImageRenderer from "./CustomImageRenderer";
import CustomTextRenderer from "./CustomTextRenderer";
import CustomVideoRenderer from "./CustomVideoRenderer";

import DefaultTheme from "@theme";

interface Props {
  bookUUID: string;
  item: BookPage;
  index: number;
  fullWidth: number;
  deviceType: Device.DeviceType;
}

const ItemListPage: React.FC<Props> = ({
  bookUUID,
  item,
  index,
  fullWidth,
  deviceType,
}) => {
  const { theme } = useChangeThemePage();

  const [listContent, setListContent] = useState<ChapterPageContentItem[]>([]);

  const generateThumbnailsAndUpdateVideos = async (
    data: ChapterPageContentItem[],
  ) => {
    const updatedData = await Promise.all(
      data?.map(async (page: ChapterPageContentItem) => {
        let updatedContent: string = page.content || "";

        if (page.content?.includes("<p>")) {
          updatedContent = updatedContent.replace(
            /<p>(.*?)<\/p>/g,
            (match, p1) => {
              return `<p><span>${p1}</span></p>`;
            },
          );
        }

        if (page.content?.includes("<video")) {
          const videoTag = updatedContent.match(/<video[^>]+>/);
          if (videoTag) {
            const videoSrc = videoTag[0].match(/src="([^"]+)"/)?.[1];

            try {
              const thumbnail = await createThumbnail({
                url: videoSrc || "",
                timeStamp: 1000,
              });

              updatedContent = updatedContent.replace(
                videoTag[0],
                `<video src="${videoSrc}" poster="${thumbnail.path}" controls></video>`,
              );
            } catch (error) {
              console.error(
                `Error generating thumbnail for video: ${videoSrc}`,
                error,
              );
            }
          }
        }

        return {
          uuid: page.uuid,
          content: updatedContent,
        };
      }),
    );

    return { content: updatedData };
  };

  useEffect(() => {
    if (item?.content) {
      generateThumbnailsAndUpdateVideos(item?.content).then((updatedData) => {
        console.log("NEW DATA PAGE: ", updatedData);

        setListContent(updatedData.content);
      });
    }
  }, [item?.content]);

  const tagStyles = useMemo(
    () => ({
      mark: {
        backgroundColor: DefaultTheme.colors.yellow68,
        lineHeight: 28,
        fontSize: 14,
        fontFamily: DefaultTheme.fonts.metropolis.regular,
        color:
          theme === BOOK_READER_THEME.DARK
            ? DefaultTheme.colors.white
            : DefaultTheme.colors.black,
      },
    }),
    [theme],
  );

  const customHTMLElementModels = {
    video: HTMLElementModel.fromCustomModel({
      tagName: "video",
      contentModel: HTMLContentModel.block,
    }),
  };

  return (
    <ViewPage>
      {listContent?.map(
        (itemContent: ChapterPageContentItem, indexContent: number) => {
          return (
            <RenderHtml
              key={indexContent}
              source={{ html: `${itemContent?.content}` }}
              tagsStyles={tagStyles}
              systemFonts={[...defaultSystemFonts]}
              contentWidth={fullWidth}
              renderers={{
                span: (props: CustomRendererProps<TText | TPhrasing>) => (
                  <CustomTextRenderer
                    index={index}
                    bookUUID={bookUUID}
                    pageUUID={item?.uuid}
                    contentUUID={itemContent?.uuid}
                    pageNumber={item?.number}
                    theme={theme}
                    rawContent={itemContent?.content}
                    {...props}
                  />
                ),
                img: (props: InternalRendererProps<TBlock>) => (
                  <CustomImageRenderer width={fullWidth - 72} {...props} />
                ),
                video: (props: InternalRendererProps<TBlock>) => (
                  <CustomVideoRenderer
                    width={fullWidth - 72}
                    deviceType={deviceType}
                    {...props}
                  />
                ),
              }}
              ignoredDomTags={["audio"]}
              customHTMLElementModels={customHTMLElementModels}
            />
          );
        },
      )}
      {item?.showLine ? (
        <ViewLine
          backgroundColor={
            theme === BOOK_READER_THEME.DARK
              ? DefaultTheme.colors.white + ALPHA_VALUE.alpha_03
              : DefaultTheme.colors.black + ALPHA_VALUE.alpha_03
          }
        />
      ) : null}
    </ViewPage>
  );
};

const ViewPage = styled.View``;

const ViewLine = styled.View<{ backgroundColor: string }>`
  width: ${screenWidth - 72}px;
  height: 1px;
  background-color: ${(props) => props.backgroundColor};
  margin-bottom: 16px;
`;

const styles = StyleSheet.create({});

export default memo(ItemListPage);
