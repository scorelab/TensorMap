from flask import jsonify, redirect, url_for, render_template, request, session
from . import main
from .. import db
from .database_models.data_preproc import dataset
import os
import json
import csv
import pandas as pd
from flask import send_file
from .template_manipulation import editExperimentConfigurations


def createJsonData(entry):
    i= 0
    columns = []
    data = []
    splitLine = None
    allData = {} 

    if entry:
        with open(entry.filePath, 'r') as f:
            index = 0
            for line in f:
                if index == 0:                
                    print(line)
                    newLine = line.replace('\n', '').replace('"','')
                    splitLine = newLine.split(",")
                    print(splitLine)                    
                    for column in splitLine:
                        temColumn = {}
                        temColumn["title"] = column
                        temColumn["field"] = column
                        columns.append(temColumn)
                    print(columns)
                else:
                    
                    newRowLine = line.replace('\n', '').replace('"','')
                    splitData = newRowLine.split(",")
                    if index==1:
                        print(line)
                        print(newRowLine)
                        print(splitData)
                        print(splitLine)
                    
                    temRow = {}
                    for i in range(len(splitData)):                        
                        temRow[splitLine[i]] = splitData[i]
                    data.append(temRow) 
                index += 1
           
        allData["columns"]=columns
        allData["data"]=data
        allData["error"]="None"
        responseData = json.dumps(allData)
        return responseData    
           
    else:
        allData["columns"]="None"
        allData["data"]="None"
        allData["error"]="Dataset Not Found"
        responseData = json.dumps(allData)
        return responseData

 
@main.route('/addData', methods=['POST'])
def addData():

    file = request.files['file']
    datasetFile = file.filename

    dirPath = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '.', 'dataset'))
    path = '{}{}{}'.format(dirPath, "/", datasetFile)

    splitFileInfo = datasetFile.split(".")
    fileName = splitFileInfo[0]
    fileFormat = splitFileInfo[1]

    if dataset.query.filter_by(fileName=fileName).one_or_none():
        return "error"

    else:

        file.save(path)   

        # writing the file entry in the database.
        data = dataset(fileName, path, fileFormat, "None","None",0)
        db.session.add(data)
        db.session.commit()           
        return splitFileInfo[0]


@main.route('/visualizeData', methods=['GET'])
def visualizeData():

    # ******************************************change
    # entry = dataset.query.filter_by(fileName=request.args['fileName']).one()

    entry = dataset.query.filter_by(fileName="store").one()
    print(entry.filePath)
    responseData = createJsonData(entry)
    return responseData


@main.route('/addRow', methods=['POST'])
def addDataRow():
    content = request.get_json()

    entry = dataset.query.filter_by(fileName=content['fileName']).one()

    print(entry.filePath)

    row = []
    dataCsv = pd.read_csv(entry.filePath)

    for column in content["columnData"]:
        if column["title"] in  content["rowdata"]:
            row.append(content["rowdata"][column["title"]])
        else:
            row.append("None")
    print(row)

    dataCsv.loc[len(dataCsv)] = row
    dataCsv.to_csv(entry.filePath, index=False)
    
    return "Done"

@main.route('/editRow', methods=['POST'])
def editDataRow():

    content = request.get_json()

    entry = dataset.query.filter_by(fileName=content['fileName']).one()

    print(entry.filePath)

    row = []
    dataCsv = pd.read_csv(entry.filePath)

    for column in content["columnData"]:
        if column["title"] in  content["newRowData"]:
            row.append(content["newRowData"][column["title"]])
        else:
            row.append("None")
    print(row)

    dataCsv.loc[content["newRowData"]["tableData"]["id"]] = row
    dataCsv.to_csv(entry.filePath, index=False)

    return "Done"

@main.route('/deleteRow', methods=['POST'])
def deleteDataRow():

    content = request.get_json()

    entry = dataset.query.filter_by(fileName=content['fileName']).one()

    print(entry.filePath)

    dataCsv = pd.read_csv(entry.filePath)

    dataCsv.drop(dataCsv.index[content["oldRowData"]["tableData"]["id"]], inplace = True)
    dataCsv.to_csv(entry.filePath, index=False)

    return "Done" 

@main.route('/deleteColumn', methods=['POST'])
def deleteDataColumn():

    content = request.get_json()

    entry = dataset.query.filter_by(fileName=content['fileName']).one()

    dataCsv = pd.read_csv(entry.filePath)

    for column in content["columnData"]:
        if column["checked"]:
            print(column["title"])
            dataCsv.drop(column["title"], axis=1, inplace=True)
        print(column)

    dataCsv.to_csv(entry.filePath, index=False)

    entry.features = "None"
    entry.labels = "None"
    entry.testPercentage = 0
    db.session.commit()

    responseData = createJsonData(entry)

    return responseData

@main.route('/downloadCSV', methods=['POST'])
def download():

    content = request.get_json()

    entry = dataset.query.filter_by(fileName=content['fileName']).one()
    fullFileName = '{}{}{}'.format(entry.fileName, ".", entry.fileFormat)
    try:
        return send_file(entry.filePath,
        attachment_filename=fullFileName,
        as_attachment=True)
    except Exception as e:
        return str(e)



@main.route('/saveConfig', methods=['POST'])
def saveConfig():

    content = request.get_json()

    featureString = ""
    labelString = ""
    index = 0

    entry = dataset.query.filter_by(fileName=content['fileName']).one()
    
    for feature in content["features"]:
        if feature["checked"] :
            print(feature["title"])
            if index == 0:
                featureString = '{}{}'.format(featureString, feature["title"])
            else:                
                featureString = '{}{}{}'.format(featureString, ",", feature["title"])
            index += 1     
    
    index = 0

    for label in content["labels"]:
        if label["checked"] :
            print(label["title"])
            if index == 0:
                labelString = '{}{}'.format(labelString, label["title"])
            else:                
                labelString = '{}{}{}'.format(labelString, ",", label["title"])
            index += 1     
    
    print(labelString)

    entry.features = featureString
    entry.labels = labelString
    entry.testPercentage = content['trainPercentage']
    db.session.commit()

    editExperimentConfigurations(featureString,labelString,content['trainPercentage'],entry)

    return "done"


@main.route('/viewData', methods=['GET'])
def viewData():
    entries = dataset.query.all()
    entries = [entry.serialize() for entry in entries]
    return json.dumps(entries)

@main.route('/sortData', methods=['POST'])
def sortData():
    allData = {}
    type = request.args.get('sortingType') or 'INCREASING'
    if (type == 'DECREASING'):
        sortedEntries = dataset.order_by(dataset.fileName.desc())
        dataset.save()
        return json.dumps(sortedEntries)
    elif (type == 'ASCENDING'):
        sortedEntries = dataset.order_by(dataset.fileName)
        dataset.save()
        return json.dumps(sortedEntries)
    else:
        allData["error"] = "Invalid sorting request."
    return json.dumps(allData)
