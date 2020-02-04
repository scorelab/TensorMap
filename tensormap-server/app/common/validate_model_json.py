def validate_json(content):

    errorString = " "

    layers = {'input': False, 'hidden':False, 'output':False}
   
    inputCounter = 0
    outputCounter = 0
    experiment_validation = True

    for i in range(len(content["graph"][0]["layers"])):
        if "Input" in content["graph"][0]["layers"][i]["name"]:
            layers['input']= True
            inputCounter += 1
        elif "Hidden" in content["graph"][0]["layers"][i]["name"]:
            layers['hidden']= True
        elif "Output" in content["graph"][0]["layers"][i]["name"]:
            layers['output']= True
            outputCounter += 1


    if layers['input'] == False and layers['output'] and layers['hidden']:
        errorString = "Input Layer is Missing."
        experiment_validation = False
    elif layers['input'] == False and layers['output'] and layers['hidden'] == False:
        errorString = "Input Layer and Hidden Layer are Missing."
        experiment_validation = False
    elif layers['input'] and layers['output'] == False and layers['hidden'] == False:
        errorString = "Output Layer and Hidden Layer are Missing."
        experiment_validation = False
    elif layers['output'] == False and layers['input'] and layers['hidden'] :
        errorString = "Output Layer is Missing."
        experiment_validation = False
    elif layers['input'] == False and layers['output'] == False and layers['hidden']:
        errorString = "Output Layer and Input Layer are Missing."
        experiment_validation = False
    elif layers['input'] == False and layers['output'] == False and layers['hidden'] == False:
        errorString = "No Layers Defined."
        experiment_validation = False
    elif layers['hidden'] == False and layers['output'] and layers['input']:
        errorString = "No Hidden Layers Defined."
        experiment_validation = False
    
    elif inputCounter != 1:
        errorString = "Too Many Input Layers Defined."
        experiment_validation = False
    elif outputCounter != 1:
        errorString = "Too Many Output Layers Defined."
        experiment_validation = False

    totalNumLayers = len(content["graph"][0]["layers"])

    for i in range(len(content["graph"][0]["layers"])):
        if "Output" in content["graph"][0]["layers"][i]["name"]:
            Outputid = content["graph"][0]["layers"][i]["id"]
            break
   
    if len(content["layer_param"]) != totalNumLayers:
        errorString += " Too many or Less Layer Parameters in layer_param."
        experiment_validation = False
    else:     
        for i in range(len(content["layer_param"])):
            try:
                units = float(content["layer_param"][i]["param"][0]["units"])
            except ValueError:
                errorString += " units is a digit."
                experiment_validation = False
                break
            if not (content["layer_param"][i]["param"][0]["activation"] == "relu" or content["layer_param"][i]["param"][0]["activation"] =="sigmoid" or content["layer_param"][i]["param"][0]["activation"]=="tanh" or content["layer_param"][i]["param"][0]["activation"]=="softmax"):
                errorString += " Invalid Activation."
                experiment_validation = False
                break
            if content["layer_param"][i]["param"][0]["units"] == 0:
                errorString += " Number of units cannot be zero."
                experiment_validation = False
                break
            if content["layer_param"][i]["id"] == Outputid:
                if content["experiment_info"]["type"] == "classification":
                    if not(content["layer_param"][i]["param"][0]["activation"] == "sigmoid" or content["layer_param"][i]["param"][0]["activation"]=="softmax"):
                        errorString += " Invalid output Activation for classification."
                        experiment_validation = False
                        break
                    elif content["experiment_info"]["multiclass"] == "True" and content["layer_param"][i]["param"][0]["activation"]=="sigmoid":
                        errorString += " Invalid output Activation for multi-class classification."
                        experiment_validation = False
                    elif content["experiment_info"]["multiclass"] == "Flase" and content["layer_param"][i]["param"][0]["activation"]=="softmax":
                        errorString += " Invalid output Activation for binary classification."
                        experiment_validation = False
                    elif content["experiment_info"]["multiclass"] == "Flase" and content["layer_param"][i]["param"][0]["units"] > 1:
                        errorString += " Invalid number of output units for binary classification."
                        experiment_validation = False
                    elif content["experiment_info"]["multiclass"] == "True" and content["layer_param"][i]["param"][0]["units"] == 1:
                        errorString += " Invalid number of output units for multi-class classification."
                        experiment_validation = False 
                    elif not (content["experiment_info"]["loss"] == "binary_crossentropy" or content["experiment_info"]["loss"] == "categorical_crossentropy"):
                        errorString += " Invalid loss function classification."
                        experiment_validation = False   
                    elif content["experiment_info"]["multiclass"] == "True" and content["experiment_info"]["loss"] == "binary_crossentropy'":
                        errorString += " Invalid loss function for multi-class classification."
                        experiment_validation = False   
                    elif content["experiment_info"]["multiclass"] == "False" and content["experiment_info"]["loss"] == "categorical_crossentropy":
                        errorString += " Invalid loss function for binary classification."
                        experiment_validation = False         
                elif content["experiment_info"]["type"] == "regression":
                    if not(content["layer_param"][i]["param"][0]["activation"] == "tanh" or content["layer_param"][i]["param"][0]["activation"]=="relu"):
                        errorString += " Invalid output Activation for regression."
                        experiment_validation = False
                        break
                    elif content["layer_param"][i]["param"][0]["units"] > 1:
                        errorString += " Invalid number of output units for regression."
                        experiment_validation = False
                        break
                    elif not(content["experiment_info"]["loss"] == "mean_squared_error"):
                        errorString += " Invalid loss function for regression."
                        experiment_validation = False                 

    if content["experiment_info"]["batch_size"] >= content["experiment_info"]["dataset_length"]:
        errorString += " Batch size should be less than dataset length."
        experiment_validation = False

    if content["experiment_info"]["loss"] == "None" or content["experiment_info"]["optimizer"] == "None" or content["experiment_info"]["batch_size"] == "None" or content["experiment_info"]["epoch"] == "None" or content["experiment_info"]["type"] == "None":
        errorString += " Not enough information to execute experiment."
        experiment_validation = False       

    if content["graph"][0]["num_unassigned_nodes"]  != 0:
        errorString += " Unassigned nodes in workspace."
        experiment_validation = False
 
    if experiment_validation:
        errorString = True    

    print(errorString)

    return errorString



    