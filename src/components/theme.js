const whitesmoke = "whitesmoke";
const white = "#FFFFFF";
const dark = "#282c34";
const InputWhite = "rgba(255,255,255,.2)";
const labelWhite = "rgba(255,255,255,.7)";
const darkborder = "rgba(0,0,0,.2)";
const color_light = "dodgerblue";
const color_dark = "#44cc88";


//define light theme
const themeLight = {
  background: whitesmoke,
  body: dark,
  navItem_styling: color_light,
  componentsBG : white,
  inputFocus : whitesmoke,
  label : dark,
  border: darkborder
};
//define dark theme
const themeDark = {
  background: dark,
  body: white,
  navItem_styling: color_dark,
  componentsBG : dark,
  inputFocus: InputWhite,
  label: labelWhite,
  border: InputWhite
};

const theme = mode => (mode === "dark" ? themeDark : themeLight);

export default theme;
