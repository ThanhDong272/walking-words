import type { FC } from "react";
import { memo } from "react";
import { styled } from "styled-components/native";

import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity } from "@utils/common";
import { moderateScale } from "@utils/layouts";

import type { FormHeaderProps } from "./index.props";

import DefaultTheme from "@theme";

const IntroduceContainer = styled.View<Layout.ResponsiveData>`
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
  align-items: flex-start;
`;

const Title = styled(Text)<Layout.ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 26, screenData)}px;
`;

const Description = styled(Text)<Layout.ResponsiveData>`
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
`;

const FormHeader: FC<FormHeaderProps> = ({ title, desc }) => {
  const screenData = useScreenData();

  return (
    <IntroduceContainer screenData={screenData}>
      <Title screenData={screenData}>{title}</Title>
      {desc && <Description screenData={screenData}>{desc}</Description>}
    </IntroduceContainer>
  );
};

export default memo(FormHeader);
