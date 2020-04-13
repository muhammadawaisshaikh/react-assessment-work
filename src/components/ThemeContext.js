import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming";
import theme from "./theme.js";

//define light mode as default
const defaultContextData = {
  dark: false,
  toggle: () => {}
};


const ThemeContext = React.createContext(defaultContextData);
//change the context of "themeContext" light / dark
const useTheme = () => React.useContext(ThemeContext);


//function to apply dark mode
const useEffectDarkMode = () => {
  const [themeState, setThemeState] = React.useState({
    dark: false,
    hasThemeMounted: false
  });
  React.useEffect(() => {
    const lsDark = localStorage.getItem("dark") === "true";
    setThemeState({ ...themeState, dark: lsDark, hasThemeMounted: true });
  }, []);

  return [themeState, setThemeState];
};
//component that applies theming on the other components
const ThemeProvider = ({ children }) => {
  const [themeState, setThemeState] = useEffectDarkMode();

  if (!themeState.hasThemeMounted) {
    return <div />;
  }
  // function that switches between modes
  const toggle = () => {
    const dark = !themeState.dark;
    localStorage.setItem("dark", JSON.stringify(dark));
    setThemeState({ ...themeState, dark });
  };

  // recover the theme to apply
  const computedTheme = themeState.dark ? theme("dark") : theme("light");

  return (
      <EmotionThemeProvider theme={computedTheme}>

        <ThemeContext.Provider
            value={{
              dark: themeState.dark,
              toggle
            }}
        >
          {children}
        </ThemeContext.Provider>
      </EmotionThemeProvider>
  );
};

export { ThemeProvider, useTheme };
