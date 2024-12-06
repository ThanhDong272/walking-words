import React from "react";
import styled from "styled-components/native";

import type { BookItemData } from "@generated/model";

import ButtonDetail from "./shared/ButtonDetail";
import DescriptionBook from "./shared/DescriptionBook";
import TitleBook from "./shared/TitleBook";

interface Props {
  item: BookItemData | null;
}

const DetailsContent: React.FC<Props> = ({ item }) => {
  return (
    <ViewMainContent>
      <TitleBook item={item} />
      <ButtonDetail item={item} />
      <DescriptionBook item={item} />
    </ViewMainContent>
  );
};

const ViewMainContent = styled.View`
  padding-horizontal: 20px;
`;

export default DetailsContent;
