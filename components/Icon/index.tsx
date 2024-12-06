import React from "react";
import createIconSetFromIcoMoon from "@expo/vector-icons/createIconSetFromIcoMoon";
import styled from "styled-components/native";

const Icon = createIconSetFromIcoMoon(
  require("./selection.json"),
  "IcoMoon",
  "icomoon.ttf",
);

interface ContainerProps {
  marginLeft?: number;
  marginRight?: number;
}

const Container = styled.TouchableOpacity<ContainerProps>`
  align-items: center;
  justify-content: center;
  ${(props) => props.marginLeft && `margin-left: ${props.marginLeft}px;`}
  ${(props) => props.marginRight && `margin-right: ${props.marginRight}px;`}
`;

const WrappedIcon = styled(Icon).attrs((props) => ({
  color: props?.color || props?.theme.colors?.black,
  size: props?.size || 24,
}))``;

interface IconButtonProps {
  style?: object;
  styledIcon?: object;
  iconName: AppIcon;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?: any;
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  size,
  color,
  style,
  styledIcon,
  disabled = false,
  hitSlop,
  children,
  ...props
}) => {
  return (
    <Container
      disabled={disabled}
      onPress={onPress}
      style={style}
      {...{ props }}
      hitSlop={hitSlop}
    >
      <WrappedIcon
        name={iconName}
        size={size}
        color={color}
        style={styledIcon}
      />
      {children}
    </Container>
  );
};

export default React.memo(IconButton);
