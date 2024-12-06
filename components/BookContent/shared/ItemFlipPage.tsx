import React, { memo, useEffect, useMemo, useState } from "react";
import { createThumbnail } from "react-native-create-thumbnail";
import type {
  CustomRendererProps,
  InternalRendererProps,
  TBlock,
  TPhrasing,
  TText,
} from "react-native-render-html";
import RenderHTML, {
  defaultSystemFonts,
  HTMLContentModel,
  HTMLElementModel,
} from "react-native-render-html";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import type * as Device from "expo-device";
import styled from "styled-components/native";

import Text from "@views/Text";

import type { ChapterPageContentItem } from "@generated/model";

import type { BookPage } from "..";

import CustomImageRenderer from "./CustomImageRenderer";
import CustomTextRenderer from "./CustomTextRenderer";
import CustomVideoRenderer from "./CustomVideoRenderer";

import DefaultTheme from "@theme";

import { BOOK_READER_THEME } from "@/constants";

interface Props {
  bookUUID: string;
  item: BookPage;
  fullWidth: number;
  deviceType: Device.DeviceType;
}

const ItemFlipPage: React.FC<Props> = ({
  bookUUID,
  item,
  fullWidth,
  deviceType,
}) => {
  const { theme } = useChangeThemePage();

  const [listContent, setListContent] = useState<ChapterPageContentItem[]>([]);

  const generateThumbnailsAndUpdateVideos = async (data: any[]) => {
    const updatedData = await Promise.all(
      data?.map(async (page: any) => {
        let updatedContent: string = page.content || "";

        if (page.content?.includes("<p")) {
          updatedContent = updatedContent.replace(
            /<p([^>]*)>(.*?)<\/p>/g,
            (_match, attributes, content) =>
              `<p${attributes}><span>${content}</span></p>`,
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
          pageUUID: page.pageUUID,
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
    <PageContainer>
      <ItemPageContainer>
        {listContent?.map(
          (itemContent: ChapterPageContentItem, indexContent: number) => {
            return (
              <RenderHTML
                key={indexContent}
                source={{ html: `${itemContent?.content}` }}
                tagsStyles={tagStyles}
                systemFonts={[...defaultSystemFonts]}
                contentWidth={fullWidth}
                renderers={{
                  span: (props: CustomRendererProps<TText | TPhrasing>) => (
                    <CustomTextRenderer
                      index={item?.number}
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
                    <CustomImageRenderer
                      width={fullWidth / 2 - 109.5}
                      {...props}
                    />
                  ),
                  video: (props: InternalRendererProps<TBlock>) => (
                    <CustomVideoRenderer
                      width={fullWidth / 2 - 109.5}
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
      </ItemPageContainer>
      <PageItemView>
        <TextCommon
          style={{ alignSelf: "center" }}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
          color={
            theme === BOOK_READER_THEME.DARK
              ? DefaultTheme.colors.white
              : DefaultTheme.colors.black
          }
        >
          {item?.number}
        </TextCommon>
      </PageItemView>
    </PageContainer>
  );
};

const PageContainer = styled.View`
  flex: 1;
  padding: 53px 42px 53px 42.5px;
`;

const ItemPageContainer = styled.View`
  flex: 1;
`;

const PageItemView = styled.View`
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
`;

const TextCommon = styled(Text)<{
  color: string;
  fontSize: number;
  fontFamily: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

export default memo(ItemFlipPage);
