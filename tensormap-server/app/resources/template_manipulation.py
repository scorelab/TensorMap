from flask import session, redirect, url_for, render_template, request
from . import main
from .. import db
from .database_models.code_gen import template_copies,user_template_index,code_layers
from .database_models.data_preproc import dataset
import os
from flask import send_file
from ..common import validate_model_json,make_model_json
import json
import shutil, os
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

def getLabelFeatures(dataString,code):

        tempString = code

        if "," in dataString:
                splitdata = dataString.split(",")
                index = 0
                for data in  splitdata:
                        if index == 0 :
                                tempString = '{}{}{}{}'.format(tempString,"'",data,"'")
                        elif index < (len(splitdata)-1):
                                tempString = '{}{}{}{}'.format(tempString,", '",data,"'")
                        elif index == (len(splitdata)-1):
                                tempString = '{}{}{}{}'.format(tempString,", '",data,"']")
                        index += 1
        else:
                tempString = '{}{}{}{}'.format(tempString,"'",dataString,"']")
        
        return tempString


def editExperimentConfigurations(featureString,labelString,trainPercentage,entry):

        csvFileName = '{}{}{}'.format(entry.fileName,".", entry.fileFormat)
        percentage = int(trainPercentage)/100

        filename = getFile()

        layerInfoReadCsvReplace = user_template_index.query.filter_by(layerId="read_csv").one()
        layerInfoXReplace = user_template_index.query.filter_by(layerId="_x").one()
        layerInfoYReplace = user_template_index.query.filter_by(layerId="_y").one()
        layerInfoDataSplitReplace = user_template_index.query.filter_by(layerId="train_test_split").one()
        
        layerInfoReadCsv = code_layers.query.filter_by(name="readcsv").one()
        layerInfoX = code_layers.query.filter_by(name="_x").one()
        layerInfoY = code_layers.query.filter_by(name="_y").one()
        layerInfoDataSplit = code_layers.query.filter_by(name="train_test_split").one()

        lineToReplaceReadCsv = layerInfoReadCsvReplace.lineNo
        tempStringReadCsv = layerInfoReadCsv.code
        tempStringReadCsv += "'" + csvFileName + "')" 
        tempStringReadCsv += "\n"

        lineToReplaceX = layerInfoXReplace.lineNo
        tempStringX = getLabelFeatures(featureString,layerInfoX.code)
        tempStringX += "\n"      

        lineToReplaceY = layerInfoYReplace.lineNo
        tempStringY = getLabelFeatures(labelString,layerInfoY.code)        
        tempStringY += "\n"
             
        lineToReplaceDataSplit = layerInfoDataSplitReplace.lineNo
        codeAttributesDataSplit = layerInfoDataSplit.attributes
        splitAttrDataSplit = codeAttributesDataSplit.split(",")
        tempStringDataSplit = layerInfoDataSplit.code
        tempStringDataSplit += splitAttrDataSplit[0] +", "+splitAttrDataSplit[1]+", "+splitAttrDataSplit[2]+"="+str(42)+", "+splitAttrDataSplit[3]+"=True, "+splitAttrDataSplit[4]+"="+str(percentage)+")"                                            
        tempStringDataSplit += "\n"

        f = open(filename, "r")
        fileContents = f.readlines()
        f.close()

        fileContents[lineToReplaceReadCsv] = tempStringReadCsv
        fileContents[lineToReplaceX] = tempStringX
        fileContents[lineToReplaceY] = tempStringY
        fileContents[lineToReplaceDataSplit] = tempStringDataSplit

        f = open(filename, "w")
        f.writelines(fileContents)
        f.close()

        update_template_copies(filename)


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
        lineToReplaceCompile = layerInfo.lineNo

        layerInfo = user_template_index.query.filter_by(layerId="network.fit").one()
        lineToReplaceFit = layerInfo.lineNo

        layerInfoCompile = code_layers.query.filter_by(name="compile").one()
        layerInfoFit = code_layers.query.filter_by(name="fit").one()

        tempCodeComile = layerInfoCompile.code
        codeAttributesCompile = layerInfoCompile.attributes
        splitAttrCompile = codeAttributesCompile.split(",")
        tempStringCompile = tempCodeComile
        tempStringCompile += splitAttrCompile[0] + " = " + content["optimizer"]+","+splitAttrCompile[1] + " = "+content["loss"]+")"                                              

        tempStringCompile += "\n"

        tempCodeFit = layerInfoFit.code
        codeAttributesFit = layerInfoFit.attributes
        splitAttrFit = codeAttributesFit.split(",")
        tempStringFit = tempCodeFit
        tempStringFit += splitAttrFit[0] + " = " + str(content["epochs"])+","+splitAttrFit[1] + " = "+"1"+","+splitAttrFit[2] + " = "+str(content["batch_size"])+")"                                              

        tempStringFit += "\n"

        f = open(filename, "r")
        fileContents = f.readlines()
        f.close()

        fileContents[lineToReplaceCompile] = tempStringCompile
        fileContents[lineToReplaceFit] = tempStringFit

        f = open(filename, "w")
        f.writelines(fileContents)
        f.close()

        update_template_copies(filename)

        return "done"

#         sample json: {
        # "optimizer":"'adam'",
        # "loss": "'sparse_categorical_crossentropy'",
        #"batch_size":100,
        #"epochs":3
        #}
# }

@main.route('/createExperiment', methods=['POST'])
def createExperiment():

        content = request.get_json()

        dirPath = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '.', 'model_templates'))
        
        if content["experimet_type"] == "regression":
                filename = '{}{}{}'.format(dirPath, "/", "keras_temp_regression.py")
        elif content["experimet_type"] == "binary_classification":
                filename = '{}{}{}'.format(dirPath, "/", "keras_temp_bi_classification.py")
        elif content["experimet_type"] == "multiclass_classification":
                filename = '{}{}{}'.format(dirPath, "/", "keras_temp_multi_classification.py") 

        destination_path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '.', 'user_template'))
        file_copy_name = '{}{}{}'.format(destination_path, "/", "user_keras_temp.py")
        shutil.copy(filename, file_copy_name)

        userId = str(content["user_id"])

        binaryFile = convertToBinaryData(file_copy_name)

        data = template_copies(userId,"user_keras_temp.py",binaryFile)
        db.session.add(data)
        db.session.commit()

        #entries for table to index lines in file
        data1 = user_template_index("userModel",17)
        data2 = user_template_index("network.compile",19)
        data3 = user_template_index("network.fit",21)
        data4 = user_template_index("read_csv",10)
        data5 = user_template_index("_x",12)
        data6 = user_template_index("_y",13)
        data7 = user_template_index("train_test_split",15)
        db.session.add(data1)
        db.session.add(data2)
        db.session.add(data3)
        db.session.add(data4)
        db.session.add(data5)
        db.session.add(data6)
        db.session.add(data7)
        db.session.commit()

        return "done"

#         sample json: {
        #"user_id": "1"
        # "experimet_type":"regression"
# }

@main.route('/deleteExperiment', methods=['POST'])
def deleteExperiment():

        content = request.get_json()

        dataset.query.filter_by(fileName=content['fileName']).delete()
        db.session.commit()

        db.session.query(user_template_index).delete()
        db.session.commit()

        template_copies.query.filter_by(id=content["user_id"]).delete()
        db.session.commit()

        tempCopy_path = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '.', 'user_template'))
        tempCopy_name = '{}{}{}'.format(tempCopy_path, "/", "user_keras_temp.py")
        if os.path.exists(tempCopy_name):
                os.remove(tempCopy_name)
        else:
                print("The file does not exist")

        return "done"

#         sample json: {
        #"user_id": "1",
        #"fileName": "store"
# }

 