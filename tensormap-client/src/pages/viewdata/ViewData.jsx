import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import * as React from "react";
import styles from "./ViewData.styles";
import Table from "./assets/Table";

class ViewData extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {}
    };
  }
  componentDidMount() {
    fetch(`${baseURL}viewData`)
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(error => {
        console.log(error);
        alert("There was some error pulling data");
      });
  }
  render() {
    console.log(this.state.data);
    const { classes } = this.props;

    return <Table data={this.state.data} />;
  }
}

ViewData.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ViewData);
