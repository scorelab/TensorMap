import {createMuiTheme} from "@material-ui/core";
import {lightBlue} from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: {
      main: '#1976d2',
    },
  },
  typography: {
    useNextVariants: true,
  },
  layout: {
    sidebarWidth: 240
  },
});

export default theme
