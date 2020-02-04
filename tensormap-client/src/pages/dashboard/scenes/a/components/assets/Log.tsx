import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';




const text_style = {
    color:"red"
  
}

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

  let newText = props.code.split('\n').map((item, i) => {

    return <p><SyntaxHighlighter language = "python" style = {docco}>{` ${item}`} </SyntaxHighlighter></p>;
  });


  return (
    <div className="log_main">
      <div>
        <AppBar position="static" color="default">
          <Tabs value={value} onChange={handleChange} >
            <Tab label="Logs" />
            <Tab label="Code" />
          </Tabs>
        </AppBar>
        
        {console.log(props.runtimeData)}
        {value === 0 && <TabContainer>{props.runtimeData}</TabContainer>}
        {console.log(props.code)}
  {value === 1 && <TabContainer>
   
      {newText}
     
        </TabContainer>}
      </div>
    </div>
  );
}

SimpleTabs.propTypes = {
  code: PropTypes.string.isRequired,
  runtimeData: PropTypes.string.isRequired,
};
