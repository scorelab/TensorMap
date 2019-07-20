import * as React from "react";
import { TrayWidget } from "./TrayWidget";
import { Application } from "./Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { Properties } from "./Properties";
import SimpleTabs from "./Log";
import { DefaultNodeModel, DiagramWidget, DefaultPortModel, DefaultLinkModel, DefaultLabelModel } from "storm-react-diagrams";
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SaveIcon from '@material-ui/icons/Save';

import { baseURL } from '../../../../../../config';

import socketIOClient from "socket.io-client";

var _ = require('lodash')

const endpoint = "ws://localhost:5000/nn";

export interface BodyWidgetProps {
  app: Application;
}

export interface BodyWidgetState {
  drawer: boolean;
  drawerlink: boolean;
  dialog: boolean;
  accuracy: boolean;
  neg_mean_square_error: boolean;
  tmp_id: string;
  dialog_group:boolean;
  layer_name:string;
  node:
  {
    id: string;
    param: Array<any>;
  }[];
  tmp_form: {
    [key: string]: any;
  };
  config: {
    [key: string]: any;
  }
}

export default class BodyWidget extends React.Component<BodyWidgetProps, BodyWidgetState> {
  constructor(props: BodyWidgetProps) {
    super(props);
    this.state = {
      drawer: false,
      drawerlink: false,
      dialog: false,
      dialog_group:false,
      tmp_id: "",
      accuracy: false,
      neg_mean_square_error: false,
      layer_name:"",
      node: [
        {
          id: "",
          param: [],
        }
      ]
      ,
      tmp_form:
      {
        units: "",
        activation: "",
      },
      config: {
        "optimizer": "'Adam'",
        "loss": "'sparse_categorical_crossentropy'",
        "metrics": [],
      }
    };

    this.handleNodeDelete = this.handleNodeDelete.bind(this)
    this.handleNodeAdd = this.handleNodeAdd.bind(this)
    this.handleNodeEdit = this.handleNodeEdit.bind(this)
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleExeConfig = this.handleExeConfig.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleExecute = this.handleExecute.bind(this)
    this.handleCloseGrouping = this.handleCloseGrouping.bind(this)
    this.handledelete = this.handledelete.bind(this)
  };

  componentDidMount() {
    const socket = socketIOClient(endpoint);
    socket.on("nn_execute", (data: any) => console.log(data));
    var model = this.props.app.getDiagramEngine().getDiagramModel();

    model.addListener({
      linksUpdated: (e) => {
        var link = e.link;
        link.extras = {
          weight: "0.3",
        };
        var data_ = link.extras as any;
        (link as DefaultLinkModel).addLabel(data_.weight);
        if (e.isCreated) {
          link.addListener({
            targetPortChanged: (e) => {
              //call function a valid link added
            }
          })
        }
        else {
          //call function link deleted
        }
      },
      nodesUpdated: (e) => {
        // call functions in here that are realted to node addition and deletetion
        var node = e.node;
        if (e.isCreated) {
          this.handleNodeAdd(node.id, node.extras.name, [], model.id);
          console.log("node created");
        }
        else {
          //call function link deleted
          this.handleNodeDelete(node.id)
          console.log("node deleted");

        }
      }
    })
  }

  toggleDrawer = (call_: boolean, node_id: string, islink: boolean) => {
    this.setState({
      tmp_form:
      {
        units: "",
        activation: "",
      },
    });
    if (islink) {
      console.log("link selected");
      this.setState({ drawerlink: call_ });
    } else {
      this.setState({ drawer: call_ });
      // console.log(node_id);
    }
  };

  get_serialized() {
    var str = JSON.stringify(this.props.app.getDiagramEngine().getDiagramModel().serializeDiagram());
    return str
  };

  handleChange = (key: number, param_name: string, event: React.ChangeEvent<HTMLInputElement>, islink: boolean, id: string) => {
    var tmp_form = this.state.tmp_form;
    if (islink) {
      var link = this.props.app.getDiagramEngine().getDiagramModel().getLink(id);
      if (link != null) {
        link.extras = {
          weight: event.target.value
        };
        var labels_node = link.labels[0] as DefaultLabelModel;
        labels_node.setLabel(event.target.value);
      }
      tmp_form[param_name] = event.target.value
      this.setState({
        tmp_form
      } as any)
    }
    else {
      tmp_form[param_name] = event.target.value
      this.setState({
        tmp_form
      } as any)
    }
  };

  handleSave = () => {
    // console.log(this.state.tmp_form);
    var param_ = [
      this.state.tmp_form,
    ]

    var new_val = [{
      id: this.state.tmp_id,
      param: param_,
    }];
    // console.log(new_val);
    var joined = this.state.node.concat(new_val);
    // console.log(joined);
    this.setState({ node: joined, });
    // console.log(this.state.node);
  }

  handleExecute = () => {
    var json_graph = this.props.app.getDiagramEngine().getDiagramModel().serializeDiagram();
    var node_data = this.state.node
    var comp_data = {
      graph: [json_graph],
      node_param: node_data
    }
    console.log(comp_data);

    // const socket = socketIOClient(endpoint);
    // socket.emit('nn_execute', comp_data, function(response: any) {
    //   console.log(response)
    // });

  }

  handleGetCode = () => {
    var json_graph = this.props.app.getDiagramEngine().getDiagramModel().serializeDiagram();
    var node_data = this.state.node
    var data = {
      graph: [json_graph],
      node_param: node_data
    }
    // console.log(data);
    var url_ = baseURL + 'getcode/';
    // console.log(url_)
    fetch(url_, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(response => console.log(response));
  }

  handleExeConfig = () => {
    var data = [this.state.config]
    console.log(data);
    this.handleClose();

    var url_ = baseURL + 'getcode/';
    fetch(url_, {
      method: 'POST',
      headers: {
        'access-control-allow-origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(response => console.log(response));
  }

  handleNodeDelete = (nodeid: string) => {
    var data = {
      layerID: nodeid
    }
    // console.log(data);
    var url_ = baseURL + 'delete/';
    fetch(url_, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(response => console.log(response));
  }

  handleNodeAdd = (nodeid: string, layertype: string, layerSpec: Array<any>, parentnode: string) => {
    var data = {
      layerId: nodeid,
      layerType: layertype,
      layerSpec: layerSpec,
      parentNodeId: parentnode
    }
    // console.log(data);
    var url_ = baseURL + 'add/';
    fetch(url_, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(response => console.log(response));
  }

  handleNodeEdit = () => {
    this.handleSave()
    this.toggleDrawer(false, "close", false)
    var new_val = [this.state.tmp_form];
    // console.log(new_val);
    var data = {
      layerId: this.state.tmp_id,
      layerSpec: new_val,
    }
    // console.log(data);
    var url_ = baseURL + 'edit/';
    fetch(url_, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(response => console.log(response));
  }

  //Dialog functions

  handleClickOpen = () => {
    this.setState({
      dialog: true
    })
  }

  handleClose = () => {
    this.setState({
      dialog: false
    })
  }

  handleClickOpenGrouping = () => {
    this.setState({
      dialog_group: true,
      layer_name:"",
    })
  }

  handleCloseGrouping = () => {
    this.setState({
      dialog_group: false
    })
  }

  handleCheckBoxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.target.checked } as any);
    var joined = this.state.config.metrics.concat(name);

    var tmp_form = this.state.config;
    tmp_form["metrics"] = joined
    this.setState({
      tmp_form
    } as any)

    // console.log(tmp_form)
    // console.log(tmp_form.metrics)
  };

  handleSelection = () => {
    var graph = this.props.app.getDiagramEngine().getDiagramModel()
    var selected = graph.getSelectedItems()

    // console.log(selected.length)
    for( var i = 0 ; i < selected.length ; ++i){
      // console.log(i
      // console.log(selected[i].constructor.name)
      if(selected[i].constructor.name === "DefaultNodeModel"){
        (selected[i] as DefaultNodeModel).extras.parent = "hi"
      }
    };
    this.handleCloseGrouping()
  };

  handledelete = () => {
			_.forEach(this.props.app.getDiagramEngine().getDiagramModel().getSelectedItems(), (element : any) => {
				//only delete items which are not locked
				if (!this.props.app.getDiagramEngine().isModelLocked(element)) {
					element.remove();
				}
			});
			this.forceUpdate();
  }


  render() {
    return (
      <div>

        <Button variant= "contained" className = { 'delete_btn'} onClick = {this.handledelete}> Delete </Button>
        <Button variant= "contained" className = { 'send_btn'} onClick = {this.handleExecute}> Get Code </Button>
        <Button variant = "contained" className = { 'exe_config_btn'} onClick = { this.handleClickOpen } > Change Exe Config </Button>
        <Button variant = "contained" className = { 'group_selection_btn'} onClick = { this.handleClickOpenGrouping } > Group Selection </Button>
        <Drawer anchor = "right" open = { this.state.drawer } onClose = {() => this.toggleDrawer(false, "close", false)}>
          <div
  					role="presentation"
            className = { "param_drawer"} >
            <h2>Node Parameters </h2>
            <form noValidate autoComplete = "off" className = { "drawer_form"} >
              <TextField  id="standard-name" label = "units" value = { this.state.tmp_form.units } onChange = {(event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(0, "units", event, false, this.state.tmp_id)} margin = "normal" >
              </TextField>
                <br />
              <TextField  id="standard-name" label = "activation" value = { this.state.tmp_form.activation } onChange = {(event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(1, "activation", event, false, this.state.tmp_id)} margin = "normal" >
              </TextField>
            </form>
                <br />
              <Button variant="contained"  onClick = { this.handleNodeEdit } >
              <SaveIcon className={ 'right_icon'} />
                  Save
              </Button>
            </div>
          </Drawer>

          <Drawer anchor = "right" open = { this.state.drawerlink } onClose = {() => this.toggleDrawer(false, "close", true)}>
            <div
            role="presentation"
            className = { "param_drawer"} >
              <h2>Link Parameters </h2>
              <form noValidate autoComplete = "off" className = { "drawer_form"} >
                <TextField  id="standard-name" label = "weight" value = { this.state.tmp_form.units } onChange = {(event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(0, "units", event, true, this.state.tmp_id)} margin = "normal" >
                </TextField>
                  <br />
                <TextField  id="standard-name" label = "activation" value = { this.state.tmp_form.activation } onChange = {(event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(1, "activation", event, false, this.state.tmp_id)} margin = "normal" >
                </TextField>
              </form>
                <br />
              <Button variant="contained"  onClick = { this.handleNodeEdit } >
                <SaveIcon className={ 'right_icon'} />
                Save
              </Button>
            </div>
          </Drawer>

          <Dialog open = { this.state.dialog } onClose = { this.handleClose } aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title" > Execution Configuration </DialogTitle>
            <DialogContent >
            <TextField
              autoFocus
              value = { this.state.config.optimizer.slice(1, -1) }
              margin = "dense"
              id = "name"
              label = "Optimizer"
              type = "text"
              onChange = {(e) => {
                  var tmp_form = this.state.config;
                  tmp_form["optimizer"] = "'" + e.target.value + "'"
                this.setState({
                    tmp_form
                  } as any)
                }}
                fullWidth
                />

            <TextField
              autoFocus
              value = { this.state.config.loss.slice(1, -1) }
              margin = "dense"
              id = "name"
              label = "loss"
              type = "text"
              onChange = {(e) => {
                  var tmp_form = this.state.config;
                  tmp_form["loss"] = "'" + e.target.value + "'"
                  this.setState({
                      tmp_form
                    } as any)
                  }}
                fullWidth
                />

          <FormControlLabel
              control={
                < Checkbox
                  onChange = { this.handleCheckBoxChange("'accuracy'") }
                  value = "accuracy"
                  color = "primary"
              />
             }
              label = "Accuracy"
              />

          <FormControlLabel
            control={
              < Checkbox
                onChange = { this.handleCheckBoxChange("'neg_mean_square_error'") }
                value = "neg_mean_square_error"
                color = "primary"
          />
            }
              label = "Neg mean square error"
              />

          </DialogContent>
          <DialogActions >
            <Button onClick={ this.handleClose } color = "primary" >
              Cancel
            </Button>
            <Button onClick = { this.handleExeConfig } color = "primary" >
              Save
            </Button>
          </DialogActions>
        </Dialog>

          <Dialog open = { this.state.dialog_group } onClose = { this.handleCloseGrouping } aria-labelledby="form-dialog-title" >
            <DialogTitle id="form-dialog-title" > Group Selected nodes </DialogTitle>
            <DialogContent >
            <TextField
              autoFocus
      				value = { this.state.layer_name }
              margin = "dense"
              id = "name"
              label = "Layer Name"
              type = "text"
      				onChange = {(e) => {
      					this.setState({
                    layer_name:e.target.value
                  })
                }}
                fullWidth
                />
          </DialogContent>
          <DialogActions >
            <Button onClick={ this.handleCloseGrouping } color = "primary" >
              Cancel
            </Button>
            <Button onClick = { this.handleSelection } color = "primary" >
              Save
            </Button>
          </DialogActions>
        </Dialog>


          <div className = "body_wf" >
            <div className="content" >
              <TrayWidget>
                <TrayItemWidget model={{ type: "in", name: 'inp_layer' }} name = "Input Layer" color = "rgb(192,255,0)" />
                <TrayItemWidget model={{ type: "out", name: 'hid_layer' }} name = "Hidden Layer" color = "rgb(0,192,255)" />
                <TrayItemWidget model={{ type: "in", name: "out_layer" }} name = "Output Layer" color = "rgb(90,102,255)" />
              </TrayWidget>

              <Properties/>


              <div
						        className = "diagram-layer"
						        onDrop = {
                        event => {
                          var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
                          var node = null;
                          if (data.name === "inp_layer") {
                            node = new DefaultNodeModel("Input", "rgb(0,102,255)");
                            node.addPort(new DefaultPortModel(false, "out-1", "out"));
                            node.extras = {
                              name: "Input Node",
                              wight: 0.5
                            }
                          } else if (data.name === "out_layer") {

                            node = new DefaultNodeModel("Output", "rgb(90,102,255)");
                            node.addPort(new DefaultPortModel(true, "in-1", "In"));
                            node.extras = {
                              name: "Output Node",
                              wight: 0.5
                            }
                          }
                          else {
                            node = new DefaultNodeModel("Dense", "rgb(0,192,255)");
                            node.addPort(new DefaultPortModel(true, "in-1", "In"));
                            node.addPort(new DefaultPortModel(false, "out-1", "Out"));
                            node.extras = {
                              name: "Dense Node",
                              wight: 0.5
                            }
                          }
                          var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
                          node.x = points.x;
                          node.y = points.y;
                          this.props.app
                            .getDiagramEngine()
                            .getDiagramModel()
                            .addNode(node);
                          this.forceUpdate();
                        }
                      }
						onDragOver = {
                event => {
                  event.preventDefault();
                }
              }

						onDoubleClick = {
                event => {
                  var selected_node = document.getElementsByClassName("srd-node--selected");
                  var selected_link = document.getElementsByClassName("srd-default-link--path-selected ")

                  if (selected_node.length > 0) {
                    // console.log(selected_node);
                    // console.log(selected_link);
                    // data-nodeid
                    var node_id = selected_node[0].getAttribute("data-nodeid");
                    // console.log(selected_node[0].getAttribute("data-nodeid"));
                    if (node_id !== null) {
                      this.toggleDrawer(true, node_id, false);
                      this.setState({
                        tmp_id: node_id,
                      })
                    }
                  }
                  else if (selected_link.length > 0) {
                    // console.log(selected_link);
                    var link_id = selected_link[1].getAttribute("data-linkid");
                    // console.log(selected_link[1].getAttribute("data-linkid"));
                    if (link_id !== null) {
                      this.setState({
                        tmp_id: link_id,
                      })
                      this.toggleDrawer(true, link_id, true);
                    }
                  }
                }
              }
              >
            <DiagramWidget
						className="srd-demo-canvas"
						diagramEngine = { this.props.app.getDiagramEngine() }
						maxNumberPointsPerLink = {0}
            allowLooseLinks={false}
            deleteKeys = {[27]}
            />

          </div>
        </div>
      </div>
      <div className="log_main"><SimpleTabs /></div>
    </div>
    );
	}
}
