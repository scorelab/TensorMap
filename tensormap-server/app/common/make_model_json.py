from .. import db
import json
from ..resources.database_models.code_gen import template_copies,user_template_index,code_layers

def getNodeVal(layerId,sentKey,json_config):
    for i in range(len(json_config["layer_param"])):
        if json_config["layer_param"][i]["id"] == layerId:
            for key, value in json_config["layer_param"][i]["param"][0].items():
                if key == sentKey:
                    return value
                    break
            break        

def iterate(splitAttr,index,pointInJSON,layerId,json_config):
    for key, value in pointInJSON.items():    
        if hasattr(value,'iteritems'):
            iterate(splitAttr,index,value,layerId,json_config)
                                                        
        elif splitAttr[index] == key:
            value = getNodeVal(layerId,key,json_config )
            pointInJSON[key]= value
            break

def controlLogic(json_config,i):
        layerType = json_config["graph"][0]["layers"][i]["layerType"]
        layerId = json_config["graph"][0]["layers"][i]["id"]

        layerInfo = code_layers.query.filter_by(name=layerType).one()
        attributeInfo = layerInfo.attributes
        splitAttr = attributeInfo.split(",")                
        layer_dict = layerInfo.kerasConfig

        for j in range(len(splitAttr)):
            pointInJSON = layer_dict["config"]
            iterate(splitAttr,j, pointInJSON,layerId,json_config)

        return layer_dict



def makeKerasModel(json_config):

    dict_list = []
    hiddenNo = 0
    parentId = "userModel"

    for i in range(len(json_config["graph"][0]["layers"])):        
        print("i:",i) 
        print(parentId)

        for k in range(len(json_config["graph"][0]["layers"])):  
            print("k:",k)
            print("parent k: ",json_config["graph"][0]["layers"][k]["parentNode"])
            

            if json_config["graph"][0]["layers"][k]["parentNode"] == parentId:
                layer_dict = controlLogic(json_config,k)
                dict_list.append(layer_dict)
                parentId = json_config["graph"][0]["layers"][k]["id"]
                print(parentId)
                break             

    layerCommon = {"name": "userModel", "layers":dict_list}
    modelCommon = {"class_name": "Sequential", "config":layerCommon, "keras_version": "2.2.4-tf", "backend": "tensorflow"}
    #Only for testing
    modelCommon["config"]["layers"][0]["input_shape"] =  [1000,]

    finalModelJSON = json.dumps(modelCommon)

    print(finalModelJSON)

    return finalModelJSON

		





