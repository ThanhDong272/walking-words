import React from "react";
import styled from "styled-components/native";

interface Props {
  size?: any;
}

const SpaceHeight: React.FC<Props> = ({ size }) => {
  return <Container size={size}></Container>;
};

const Container = styled.View<{ size: number }>`
  height: ${(props) => props.size}px;
`;

export default SpaceHeight;
