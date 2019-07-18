from flask import session, redirect, url_for, render_template, request
from . import main
from .. import db
from .database_models.code_gen import template_copies,user_template_index,code_layers
import os
from flask import send_file
from ..common import validate_model_json,make_model_json
import json
from flask import jsonify



def convertToBinaryData(filename):
    #Convert digital data to binary format
    with open(filename, 'rb') as file:
        binaryData = file.read()
    return binaryData

def write_file(data, filename):
    # Convert binary data to proper format and write it on Hard Disk
    with open(filename, 'wb') as file:
        file.write(data)

def edit_code(layerInfo,content):
        tempCode = layerInfo.code
        codeAttributes = layerInfo.attributes
        splitAttr = codeAttributes.split(",")
        tempString = tempCode
        for i in range(len(splitAttr)):
                tempString += splitAttr[i] + " = " + content["layerSpec"][i]
                if i != (len(content["layerSpec"])-1) :
                        tempString += ","
                else:
                         tempString += "))"
        return tempString  

def getFile():
        #get template file from database
        dirPath = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '.', 'user_template'))
        result = template_copies.query.filter_by(id="1").one()
        filename = '{}{}{}'.format(dirPath, "/", result.fileName)
        write_file(result.data,filename)
        return filename

def update_template_copies(filename):
        #updating data saved in table template_copies
        result = template_copies.query.filter_by(id="1").one()
        result.data = convertToBinaryData(filename)
        db.session.commit()

def edit_line_no(filename):
        allLayers = user_template_index.query.all()

        for layer in allLayers:
                with open(filename, "r") as f:
                                lines = f.readlines()
                f.close()
                for i, line in enumerate(lines):
                        if layer.layerId in line:
                                print("line no: ",i)
                                result = user_template_index.query.filter_by(layerId = layer.layerId).one()
                                result.lineNo = i
                                db.session.commit()   


@main.route('/add', methods=['POST'])
def addNewLine():

        content = request.get_json()

        filename = getFile()        

        parentNodeInfo = user_template_index.query.filter_by(layerId=content["parentNodeId"]).one()
        lineToEnter = parentNodeInfo.lineNo + 2
        print(parentNodeInfo)
        print(lineToEnter)

        layerInfo = code_layers.query.filter_by(name=content["layerType"]).one()

        codeToEnter = edit_code(layerInfo,content)
        codeToEnter += "\n\n"

        f = open(filename, "r")
        fileContents = f.readlines()
        f.close()

        fileContents.insert(lineToEnter, codeToEnter)

        f = open(filename, "w")
        tempFileContents = "".join(fileContents)
        f.write(tempFileContents)
        f.close()

        update_template_copies(filename)

        #adding layer to user template index table
        data = user_template_index(content["layerId"],lineToEnter)
        db.session.add(data)
        db.session.commit()
        user_template_index

        edit_line_no(filename)

        return "done"

#         sample json: {
# 	"layerId": "87ba7b08-0557-475f-839f-0729f70c0389",
# 	"layerType": "dense",
# 	"layerSpec": ["2","'relu'","'87ba7b08-0557-475f-839f-0729f70c0389'"],
# 	"parentNodeId": "userModel"
# }

@main.route('/edit', methods=['POST'])
def editConfig():

        content = request.get_json()

        filename = getFile()

        layerInfo = user_template_index.query.filter_by(layerId=content["layerId"]).one()
        lineToReplace = layerInfo.lineNo

        layerInfo = code_layers.query.filter_by(name=content["layerType"]).one()

        codeToReplace = edit_code(layerInfo,content)
        codeToReplace += "\n"

        f = open(filename, "r")
        fileContents = f.readlines()
        f.close()

        fileContents[lineToReplace] = codeToReplace

        f = open(filename, "w")
        f.writelines(fileContents)
        f.close()

        update_template_copies(filename)

        return "done"

#         sample json: {
# 	"layerId": "87ba7b08-0557-475f-839f-0729f70c0389",
# 	"layerType": "dense",
# 	"layerSpec": ["8","'tanh'","'87ba7b08-0557-475f-839f-0729f70c0389'"],
# }


@main.route('/delete', methods=['POST'])
def deleteLine():

        content = request.get_json()

        filename = getFile()

        layerInfo = user_template_index.query.filter_by(layerId=content["layerId"]).one()
        lineToDelete = layerInfo.lineNo

        print(lineToDelete)

        with open(filename, "r") as f:
                lines = f.readlines()
        f.close()
        with open(filename, "w") as f:
                for i, line in enumerate(lines):
                        if (i != lineToDelete) and (i != (lineToDelete+1)):
                                f.write(line)                        
        f.close()

        user_template_index.query.filter_by(layerId=content["layerId"]).delete()
        db.session.commit()

        edit_line_no(filename)
        
        update_template_copies(filename)

        return "done"

#         sample json: {
# 	"layerId": "87ba7b08-0557-475f-839f-0729f70c0389",
# }

@main.route('/getCode', methods=['GET'])
def sendFile():
        content = request.get_json()
        print("aesxfcgvhbj")
        print(content)
            
        filename = getFile()       

        result = validate_model_json.validate_json(content)

        if result == True:
                try:
                        return send_file(filename,
                        attachment_filename='user_keras_temp.py',
                        as_attachment=True)
                except Exception as e:
                        return str(e)
        else:
                return result

#         sample json: <the complete JSON of model>

@main.route('/compileConfig', methods=['POST'])
def editExe():

        content = request.get_json()
            
        filename = getFile()   

        layerInfo = user_template_index.query.filter_by(layerId="network.compile").one()
        lineToReplace = layerInfo.lineNo

        layerInfo = code_layers.query.filter_by(name="compile").one()

        tempCode = layerInfo.code
        codeAttributes = layerInfo.attributes
        splitAttr = codeAttributes.split(",")
        tempString = tempCode
        tempString += splitAttr[0] + " = " + content["optimizer"]+","+splitAttr[1] + " = "+content["loss"]+")"                                              

        tempString += "\n"

        f = open(filename, "r")
        fileContents = f.readlines()
        f.close()

        fileContents[lineToReplace] = tempString

        f = open(filename, "w")
        f.writelines(fileContents)
        f.close()

        update_template_copies(filename)

        return "done"

#         sample json: {
        # "optimizer":"'adam'",
        # "loss": "'sparse_categorical_crossentropy'"
# }

         
                
##adding file to database when user is first created
# file = convertToBinaryData("/home/suleka/Documents/Tensormap_GSOC/TensorMap/tensormap-server/app/resources/user_template/user_keras_temp.py")
# data = template_copies("1","user_keras_temp.py",file)
# db.session.add(data)
# db.session.commit()

from flask_restful import Resource
from flask import request
from flask import jsonify
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.metrics import f1_score, recall_score, precision_score, accuracy_score
import tensorflow as tf
import json
from .. import socketio
from flask_socketio import emit
from ..common import validate_model_json, make_model_json
import numpy as np

class ShowProgress(keras.callbacks.Callback):
    
    # This function is called at the end of each epoch
    def on_epoch_end(self, epoch, logs={}):
        loss = logs.get('loss')
        epoch = epoch
        
        # trainingResults = {}
        # trainingResults['loss'] = float(loss)
        # trainingResults['epoch']= epoch
        # trainingResults = json.dumps(results)        
            
        # #TO_DO - change according to frontend
        # emit('sample_response', trainingResults, namespace='/samplenamespace')

get_progress = ShowProgress()

@main.route('/nn', methods=['POST'])
def nn_execute():

    nnmodelconfig = request.get_json()

    resultString = validate_model_json.validate_json(nnmodelconfig)

    if resultString == True:

        modelJSON=make_model_json.makeKerasModel(nnmodelconfig)

        np.random.seed(0)

        number_of_features = 1000

        np_load_old = np.load

        np.load = lambda *a,**k: np_load_old(*a, allow_pickle=True, **k)

        (train_data, train_labels), (test_data, test_labels) = imdb.load_data(num_words=number_of_features)

        np.load = np_load_old

        tokenizer = Tokenizer(num_words=number_of_features)
        train_features = tokenizer.sequences_to_matrix(train_data, mode='binary')
        test_features = tokenizer.sequences_to_matrix(test_data, mode='binary')

        model = keras.models.model_from_json(modelJSON)

        loss = str(nnmodelconfig["experiment_info"]["loss"])
        optimizer = str(nnmodelconfig["experiment_info"]["optimizer"])

        model.compile(loss=  loss, 
                        optimizer= optimizer)        

        model.fit(train_features,
                        train_labels, 
                        epochs= nnmodelconfig["experiment_info"]["epoch"], 
                        verbose=1, 
                        batch_size=nnmodelconfig["experiment_info"]["batch_size"],
                        callbacks=[get_progress]) 

        test_loss = model.evaluate(test_features, test_labels)

        prediction = model.predict(test_features, verbose=1)

        print(len(prediction[0]))
        print(prediction[0])

        if nnmodelconfig["experiment_info"]["type"] == "regression":
            mse = mean_squared_error(test_labels, prediction)
            rmse = sqrt(meanSquaredError)
            mae = mean_absolute_error(test_labels, prediction)

            metrics = {}
            metrics['loss'] = float(test_loss)
            metrics['mae']= float(mae)
            metrics['rmse']= float(rmse)
            metrics['mse']= float(mse)
            metrics['accuracy'] = None
            metrics['f1']= None
            metrics['precision']= None
            metrics['recall']= None
            metrics = json.dumps(metrics)     

        elif nnmodelconfig["experiment_info"]["type"] == "classification":
            accuracy=None
            f1=None
            precision=None
            recall=None

            if nnmodelconfig["experiment_info"]["multiclass"]  == "True":
                argmax_pred_array = []
                argmax_true_array = []

                for i in range(len(prediction)):
                    argmax_pred_array.append(np.argmax(prediction[i], 0))
                    argmax_true_array.append(np.argmax(test_y[i], 0))

                argmax_true_array=(np.array(argmax_true_array, dtype=np.int32)).tolist()
                argmax_pred_array=(np.array(argmax_pred_array, dtype=np.int32)).tolist()

                accuracy = accuracy_score(argmax_true_array, argmax_pred_array)
                f1 = f1_score(argmax_true_array, argmax_pred_array, average="macro")
                recall = recall_score(y_true=argmax_true_array, y_pred=argmax_pred_array, average='macro')
                precision = precision_score(argmax_true_array, argmax_pred_array, average='macro')

            elif nnmodelconfig["experiment_info"]["multiclass"]  == "False" : 
                prediction = prediction.astype(int)   
                accuracy = accuracy_score(test_labels, prediction)
                f1 = f1_score(test_labels, prediction, average="macro")
                recall = recall_score(y_true=test_labels, y_pred=prediction, average='macro')
                precision = precision_score(test_labels, prediction, average='macro')           

            metrics = {}
            metrics['loss'] = float(test_loss)
            metrics['mae']= None
            metrics['rmse']= None
            metrics['mse']= None
            metrics['accuracy'] = float(accuracy)
            metrics['f1']= float(f1)
            metrics['precision']= float(precision)
            metrics['recall']= float(recall)
            metrics = json.dumps(metrics)  

        #TO_DO - change according to frontend
        print(metrics)
        return(metrics)
        # emit('sample_response', metrics, namespace='/samplenamespace')
    
    else:
        results = {}
        results['error'] = resultString
        results = json.dumps(results)

        #TO_DO - change according to frontend
        print("done in error path")
        return(results)
        # emit('sample_response', results, namespace='/samplenamespace')


    








