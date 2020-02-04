from ... import db
from sqlalchemy.dialects.mysql import VARCHAR, BLOB, INTEGER,TEXT, JSON

class dataset(db.Model):
    fileName = db.Column(VARCHAR(50), primary_key=True)
    filePath = db.Column(VARCHAR(1000))
    fileFormat = db.Column(VARCHAR(50))
    features = db.Column(VARCHAR(1000))
    labels = db.Column(VARCHAR(1000))
    testPercentage = db.Column(INTEGER)

    def __init__(self, fileName, filePath, fileFormat,features,labels,testPercentage):
        self.fileName = fileName
        self.filePath = filePath
        self.fileFormat = fileFormat
        self.features = features
        self.labels = labels
        self.testPercentage = testPercentage

    def serialize(self):
        return  {
            'fileName': self.fileName,
            'filePath': self.filePath,
            'fileFormat': self.fileFormat,
            'features' : self.features,
            'labels' :self.labels,
            'testPercentage' : self.testPercentage
        }