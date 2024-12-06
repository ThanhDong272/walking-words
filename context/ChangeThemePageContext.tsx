import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";

import { BOOK_READER_THEME } from "@constants";

interface ChangeThemePageContextType {
  theme: BOOK_READER_THEME;
  onChangeTheme: () => void;
}

const ChangeThemePageContext = createContext<
  ChangeThemePageContextType | undefined
>(undefined);

export const ChangeThemePageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState(BOOK_READER_THEME.DARK);

  const onChangeTheme = () => {
    if (theme === BOOK_READER_THEME.DARK) {
      setTheme(BOOK_READER_THEME.LIGHT);
    } else {
      setTheme(BOOK_READER_THEME.DARK);
    }
  };

  return (
    <ChangeThemePageContext.Provider
      value={{
        theme,
        onChangeTheme,
      }}
    >
      {children}
    </ChangeThemePageContext.Provider>
  );
};

export const useChangeThemePage = () => {
  const context = useContext(ChangeThemePageContext);
  if (context === undefined) {
    throw new Error(
      "useReadAudio must be used within an ChangeThemePageProvider",
    );
  }
  return context;
};
