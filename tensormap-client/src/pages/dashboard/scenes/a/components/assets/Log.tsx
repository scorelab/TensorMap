import React from "react";
import { useRef } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Button } from "@material-ui/core";
import Filesaver from "file-saver";
import GetAppIcon from "@material-ui/icons/GetApp";

interface TabContainerProps {
  children?: React.ReactNode;
}

interface SimpleTabsProps {
  divStyle?: string;
  className?: string;
  exportStyle?: string | undefined;
  divStyle?: string | undefined;
  code: string;
  runtimeData: string;
}

function TabContainer(props: TabContainerProps) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default function SimpleTabs(props: SimpleTabsProps) {
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  let newText = props.code.split("\n").map((item, i) => {
    return <p key={i}>{item}</p>;
  });
  function exportPython() {
    var blob = new Blob([props.code], { type: "text/x-python;charset=utf-8" });
    Filesaver.saveAs(blob, "hello-world.py");
  }

  function copyCode() {
    const node = document.createElement("textarea");
    console.log("button clicked!");

    node.innerText = props.code;
    console.log(node.value);
    document.body.appendChild(node);
    node.select();
    if (document.execCommand("copy")) {
      window.alert("Code Copied");
    }
    document.body.removeChild(node);
  }
  return (
    <div className="log_main">
      <div>
        <AppBar position="static" color="default">
          <Tabs value={value} onChange={handleChange} variant="scrollable">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Logs" />
            <Tab label="Code" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>{props.runtimeData}</TabContainer>}
        {value === 1 && (
          <div className={props.divStyle}>
            <TabContainer>{newText}</TabContainer>
            <Button
              variant="contained"
              className={props.className}
              onClick={copyCode}
            >
              <FileCopyIcon fontSize="small" />
              Copy Code To Clipboard
              className={props.exportStyle}
              onClick={exportPython}
            >
              <GetAppIcon fontSize="small" /> Export to Python
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

SimpleTabs.propTypes = {
  code: PropTypes.string.isRequired,
  runtimeData: PropTypes.string.isRequired
};
