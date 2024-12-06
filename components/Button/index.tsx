import BaseButton from "./BaseButton";
import type { BaseButtonProps } from "./index.props";
import TextButton from "./TextButton";

const Button = (props: BaseButtonProps) => {
  return <BaseButton {...props} />;
};

export default Button;

Button.Text = TextButton;
