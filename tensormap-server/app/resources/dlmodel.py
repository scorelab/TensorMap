from flask_restful import Resource
from flask import request
from flask import jsonify
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.metrics import f1_score, recall_score, precision_score, accuracy_score
from sklearn.model_selection import train_test_split
import tensorflow as tf
import json
from .. import socketio
from flask_socketio import emit
from ..common import validate_model_json, make_model_json
from .database_models.data_preproc import dataset
import pandas as pd
import numpy as np

class ShowProgress(keras.callbacks.Callback):
    
    # This function is called at the end of each epoch
    def on_epoch_end(self, epoch, logs={}):
        loss = logs.get('loss')
        epoch = epoch
        
        trainingResults = {}
        trainingResults['loss'] = float(loss)
        trainingResults['epoch']= epoch
        trainingResults = json.dumps(results)        
            
        #TO_DO - change according to frontend
        emit('sample_response', trainingResults, namespace='/samplenamespace')

get_progress = ShowProgress()

@socketio.on('nn_execute', namespace='/nn')
def nn_execute(nnmodelconfig):

    resultString = validate_model_json.validate_json(nnmodelconfig)

    if resultString == True:

        modelJSON=make_model_json.makeKerasModel(nnmodelconfig)

        np.random.seed(0)

        entry = dataset.query.filter_by(fileName=nnmodelconfig["experiment_info"]["fileName"]).one()

        dataCsv = pd.read_csv(entry.filePath)

        featureString = entry.features
        labelString = entry.labels

        splitFeatures = featureString.split(",")
        splitLabels = labelString.split(",")

        testPercentage = int(entry.testPercentage)/100

        _X = dataCsv[splitFeatures]
        _y = dataCsv[splitLabels]

        train_features, train_labels, test_features, test_labels = train_test_split(_X, _y, random_state=42, shuffle=True, test_size=testPercentage)

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
        emit('sample_response', metrics, namespace='/samplenamespace')
    
    else:
        results = {}
        results['error'] = resultString
        results = json.dumps(results)

        #TO_DO - change according to frontend
        emit('sample_response', results, namespace='/samplenamespace')

