from ... import db
from sqlalchemy.dialects.mysql import VARCHAR, BLOB, INTEGER,TEXT, JSON

class template_copies(db.Model):
    id = db.Column(VARCHAR(50),primary_key=True)
    fileName = db.Column(VARCHAR(50))
    data = db.Column(BLOB)

    def __init__(self,id,fileName,data):
        self.id = id
        self.fileName = fileName
        self.data = data
        
class user_template_index(db.Model):
    __tablename__ = 'user_template_index'
    layerId = db.Column(VARCHAR(50),primary_key=True)
    lineNo = db.Column(INTEGER) 
    
    def __init__(self,layerId,lineNo):
        self.layerId = layerId
        self.lineNo = lineNo

class code_layers(db.Model):
    name = db.Column(VARCHAR(255),primary_key=True)
    code = db.Column(VARCHAR(500)) 
    attributes = db.Column(VARCHAR(500))
    kerasConfig = db.Column(JSON) 
    
    def __init__(self,name,code,attributes,kerasConfig):
        self.name = name
        self.code = code
        self.attributes = lineattributesNo
        self.kerasConfig = kerasConfig



