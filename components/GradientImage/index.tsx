import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import DefaultTheme from "@theme";

interface Props {
  children: React.ReactNode;
}

const GradientImage: React.FC<Props> = ({ children }) => {
  return (
    <ImageContainer>
      {children}
      <LinearGradient
        colors={["transparent", DefaultTheme.colors.black10]}
        style={styles.gradientBottom}
      />
      <LinearGradient
        colors={[DefaultTheme.colors.black10, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientLeft}
      />
      <LinearGradient
        colors={["transparent", DefaultTheme.colors.black10]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientRight}
      />
    </ImageContainer>
  );
};

const ImageContainer = styled.View`
  overflow: hidden;
`;

const styles = StyleSheet.create({
  gradientBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "20%",
  },
  gradientTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "30%",
  },
  gradientLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "30%",
  },
  gradientRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "30%",
  },
});

export default GradientImage;
