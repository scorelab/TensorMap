import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AddData from '../../../../adddata/AddData';
import ViewData from '../../../../viewdata/ViewData';


interface TabContainerProps {
  children?: React.ReactNode;
}

interface SimpleTabsProps {
  code:string;
  runtimeData:string;
}

function TabContainer(props: TabContainerProps) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function SimpleTabs(props: SimpleTabsProps) {
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  return (
    <div >
        <AppBar position="static" color="default">
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="disabled tabs example">
              <Tab label="Upload Data" />
              <Tab label="Uploaded Data" />
            </Tabs>
        </AppBar>
          {value === 0 && <AddData/>}
          {value === 1 && <ViewData/>}
    </div>
  );
}

SimpleTabs.propTypes = {
  code: PropTypes.string,
  runtimeData: PropTypes.string,
};
