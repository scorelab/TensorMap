import * as React from "react";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export interface PropertiesProps {

}

export interface PropertiesState {}

export class Properties extends React.Component<PropertiesProps, PropertiesState> {
	constructor(props: PropertiesProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<section className="properties">
	      <ExpansionPanel square>
	        <ExpansionPanelSummary
	          expandIcon={<ExpandMoreIcon />}
	          aria-controls="panel1a-content"
	          id="panel1a-header"
	        >
	          <Typography>Properties</Typography>
	        </ExpansionPanelSummary>
	        <ExpansionPanelDetails>
	          <Typography>
							This is a properties of...
	          </Typography>
	        </ExpansionPanelDetails>
	      </ExpansionPanel>
    </section>
		);
	}
}
