import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from sklearn.metrics import f1_score, recall_score, precision_score, accuracy_score
from sklearn.model_selection import train_test_split
import pandas as pd

np.random.seed(0)

dataCsv = pd.read_csv()
        
_x = dataCsv[]
_y = dataCsv[]

x_train, y_train, x_test, y_test = train_test_split(_x, _y, random_state=42, shuffle=True, test_size=)

network = tf.keras.models.Sequential(name='userModel')

network.compile (optimizer = ,loss = )

mod_history = network.fit (x_train, y_train, epochs=, verbose=1, batch_size=)

test_loss, = network.evaluate(x_test, y_test)

predictions = network.predict(x_test, verbose=1)

prediction = prediction.astype(int)
accuracy = accuracy_score(test_labels, prediction)
f1 = f1_score(test_labels, prediction, average="macro")
recall = recall_score(y_true=test_labels, y_pred=prediction, average='macro')
precision = precision_score(test_labels, prediction, average='macro')           

print("Accuracy: ",accuracy)
print("F1: ",f1)
print("Recall: ",recall)
print("Precision: ",precision)

with open("results.csv", "w") as f:
    writer = csv.writer(f)
    writer.writerows(zip(y_test,predictions))


