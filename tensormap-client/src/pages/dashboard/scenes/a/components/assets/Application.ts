import * as SRD from "storm-react-diagrams";

export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = new SRD.DiagramEngine();
		this.diagramEngine.installDefaultFactories();
    this.activeModel = new SRD.DiagramModel();
		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setDiagramModel(this.activeModel);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
