import * as React from "react";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  Animated,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import styles, { _textInputStyle } from "./styled";

import DefaultTheme from "@theme";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const MAIN_COLOR = DefaultTheme.colors.black;
const ORIGINAL_COLOR = "transparent";
const PLACEHOLDER_COLOR = DefaultTheme.colors.black0F;
const ORIGINAL_VALUE = 0;
const ANIMATED_VALUE = 1;

export interface IInteractiveTextInputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  iconLeftContainerStyle?: StyleProp<ViewStyle>;
  iconImageStyle?: StyleProp<ImageStyle>;
  iconLeftImageStyle?: StyleProp<ImageStyle>;
  iconImageSource?: ImageSourcePropType;
  iconLeftImageSource?: ImageSourcePropType;
  ImageComponent?: any;
  IconComponent?: any;
  enableIcon?: boolean;
  enableIconLeft?: boolean;
  mainColor?: string;
  originalColor?: string;
  animatedPlaceholderTextColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disableIconPress?: boolean;
  onIconPress?: () => void;
  disableIconLeftPress?: boolean;
  onIconLeftPress?: () => void;
  inputRef?: React.RefObject<TextInput>;
}

interface IState {}

export default class InteractiveTextInput extends React.Component<
  IInteractiveTextInputProps,
  IState
> {
  interpolatedColor: Animated.Value;

  constructor(props: IInteractiveTextInputProps) {
    super(props);
    this.interpolatedColor = new Animated.Value(ORIGINAL_VALUE);
    this.state = {};
  }

  showOriginColor = () => {
    Animated.timing(this.interpolatedColor, {
      duration: 350,
      toValue: ORIGINAL_VALUE,
      useNativeDriver: false,
    }).start();
  };

  showFocusColor = () => {
    Animated.timing(this.interpolatedColor, {
      duration: 450,
      toValue: ANIMATED_VALUE,
      useNativeDriver: false,
    }).start();
  };

  renderIconLeft = () => {
    const {
      enableIconLeft,
      iconLeftImageStyle,
      iconLeftContainerStyle,
      iconLeftImageSource,
      disableIconLeftPress,
      onIconLeftPress,
      ImageComponent = Image,
      IconComponent = TouchableOpacity,
    } = this.props;

    return (
      enableIconLeft && (
        <IconComponent
          disabled={disableIconLeftPress}
          style={[styles.iconLeftContainerStyle, iconLeftContainerStyle]}
          onPress={onIconLeftPress}
        >
          <ImageComponent
            resizeMode="contain"
            source={iconLeftImageSource}
            style={[styles.iconLeftImageStyle, iconLeftImageStyle]}
          />
        </IconComponent>
      )
    );
  };

  renderIcon = () => {
    const {
      enableIcon,
      iconImageStyle,
      iconContainerStyle,
      iconImageSource,
      disableIconPress,
      onIconPress,
      ImageComponent = Image,
      IconComponent = TouchableOpacity,
    } = this.props;

    return (
      enableIcon && (
        <IconComponent
          disabled={disableIconPress}
          style={[styles.iconContainerStyle, iconContainerStyle]}
          onPress={onIconPress}
        >
          <ImageComponent
            resizeMode="contain"
            source={iconImageSource}
            style={[styles.iconImageStyle, iconImageStyle]}
          />
        </IconComponent>
      )
    );
  };

  renderAnimatedTextInput = () => {
    const mainColor = this.props.mainColor || MAIN_COLOR;
    const originalColor = this.props.originalColor || ORIGINAL_COLOR;
    const animatedPlaceholderTextColor =
      this.props.animatedPlaceholderTextColor || PLACEHOLDER_COLOR;

    const borderColor = this.interpolatedColor.interpolate({
      inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
      outputRange: [originalColor, mainColor],
    });
    const placeholderTextColor = this.interpolatedColor.interpolate({
      inputRange: [ORIGINAL_VALUE, ANIMATED_VALUE],
      outputRange: [animatedPlaceholderTextColor, mainColor],
    });
    return (
      <AnimatedTextInput
        ref={this.props.inputRef}
        placeholderTextColor={placeholderTextColor}
        placeholder="Search"
        {...this.props}
        style={[_textInputStyle(borderColor), this.props.textInputStyle]}
        onFocus={() => {
          this.showFocusColor();
          this.props.onFocus && this.props.onFocus();
        }}
        onBlur={() => {
          this.showOriginColor();
          this.props.onBlur && this.props.onBlur();
        }}
      />
    );
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderIconLeft()}
        {this.renderAnimatedTextInput()}
        {this.renderIcon()}
      </View>
    );
  }
}
