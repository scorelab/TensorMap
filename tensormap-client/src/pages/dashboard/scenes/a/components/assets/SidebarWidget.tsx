import * as React from "react";

export interface SidebarWidgetProps {
}

export interface SidebarWidgetState {}

export class SidebarWidget extends React.Component<SidebarWidgetProps, SidebarWidgetState> {

	constructor(props: SidebarWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		console.log(this.props.children);
		return (
			<div className="tray">
				{this.props.children}
			</div>);
	}
}
