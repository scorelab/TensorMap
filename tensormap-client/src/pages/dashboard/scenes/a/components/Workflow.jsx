import * as React   from 'react'
import BodyWidget from './assets/BodyWidget'
import { Application } from "./assets/Application";
import "./sass/workflow.scss";

class Workflow extends React.Component {

  render() {
    var app = new Application();
    return (
        <BodyWidget app={app} />
    )
  }
}

export default Workflow
