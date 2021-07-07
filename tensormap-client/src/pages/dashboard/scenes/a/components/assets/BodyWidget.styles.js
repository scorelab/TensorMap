import { Theme } from "@material-ui/core/styles";
import { red, grey, green, blue } from "@material-ui/core/colors";
//import { flexbox } from "@material-ui/system";
const styles = theme => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  select: {
    display: "flex",
    alignItems: "center"
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    margin: theme.spacing(1)
  },
  grey: {
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
    margin: theme.spacing(1)
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    margin: theme.spacing(1)
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    margin: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  copybutton: {
  height: "40px",
    margin: theme.spacing(2)
  },
  exportButton: {
    height: "40px",
    margin: theme.spacing(2)
  },
  divStyle: {
    display: "flex",
    justifyContent: "space-between"
  }
});

export default styles;
