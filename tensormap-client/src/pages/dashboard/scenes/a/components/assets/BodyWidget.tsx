import * as React from "react";
import { TrayWidget } from "./TrayWidget";
import { Application } from "./Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget, DefaultPortModel } from "storm-react-diagrams";

const _ = require("lodash")


export interface BodyWidgetProps {
	app: Application;
}

export interface BodyWidgetState {}

export default class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
	constructor(props: BodyWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="body_wf">
				<div className="content">
					<TrayWidget>
						<TrayItemWidget model={{ type: "in" }} name="Input Layer" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: "out" }} name="Hidden Layer" color="rgb(0,192,255)" />
					</TrayWidget>
					<div
						className="diagram-layer"
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getDiagramModel()
									.getNodes()
							).length;

							var node = null;
							if (data.type === "in") {
								node = new DefaultNodeModel("Input " + (nodesCount + 1), "rgb(192,255,0)");
								node.addInPort("In");
							} else {
								node = new DefaultNodeModel("Hidden " + (nodesCount + 1), "rgb(0,192,255)");
								node.addPort(new DefaultPortModel(true, "in-1", "In"));
								node.addPort(new DefaultPortModel(false, "out-1", "Out"));
							}
							var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.x = points.x;
							node.y = points.y;
							this.props.app
								.getDiagramEngine()
								.getDiagramModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}
					>
						<DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
					</div>
				</div>
			</div>
		);
	}
}
