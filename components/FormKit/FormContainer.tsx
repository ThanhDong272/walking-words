import { memo } from "react";
import { styled } from "styled-components/native";

import { moderateScale, verticalScale } from "@utils/layouts";

const FormContainer = styled.View<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 51 : 42, screenData)}px;
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
  width: 100%;
`;

export default memo(FormContainer);
