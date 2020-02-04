import * as React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
}

export interface TrayItemWidgetState {}

export class TrayItemWidget extends React.Component<TrayItemWidgetProps, TrayItemWidgetState> {
	constructor(props: TrayItemWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<ListItem
						button style={{ borderColor: '#fff' }}
						draggable={true}
						onDragStart={event => {
							event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
						}}
						className="tray-item">
				<ListItemText primary={this.props.name} />
			</ListItem>
		);
	}
}
