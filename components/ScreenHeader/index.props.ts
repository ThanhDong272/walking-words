export type BaseScreenHeaderProps = {
  headerRight?: React.ReactNode;
  /**@default back button */
  headerLeft?: React.ReactNode;
  headerTitle?: string;
  onPressBackOption?: () => void;
  showButtonBack?: boolean;
};

export type IntroduceScreenHeaderProps = {
  headerTitle?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerLeft?: React.ReactNode;
};
