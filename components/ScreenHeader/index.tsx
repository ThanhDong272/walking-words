import BaseScreenHeader from "./BaseScreenHeader";
import type { BaseScreenHeaderProps } from "./index.props";
import IntroduceHeader from "./IntroduceHeader";

const ScreenHeader = (props: BaseScreenHeaderProps) => {
  return <BaseScreenHeader {...props} />;
};

export default ScreenHeader;

ScreenHeader.Introduce = IntroduceHeader;
