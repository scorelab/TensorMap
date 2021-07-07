[![Build Status](https://travis-ci.com/scorelab/TensorMap.svg?branch=master)](https://travis-ci.com/scorelab/TensorMap)  [![Join the chat at https://gitter.im/scorelab/TensorMap](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/scorelab/TensorMap) 
[![HitCount](http://hits.dwyl.com/scorelab/TensorMap.svg)](http://hits.dwyl.com/scorelab/TensorMap)

![picture](docs/tm.png)

# TensorMap

TensorMap is a web application that will allow the users to create machine learning algorithms visually. TensorMap supports reverse engineering of the visual layout to a Tensorflow implementation in preferred languages. The goal of the project is to let the beginners play with machine learning algorithms in Tensorflow without less background knowledge about the library. For more details about the project, read our [project wiki.](https://github.com/scorelab/TensorMap/wiki)

## Getting Started
Follow these steps to set up TensorMap on your local machine.

First clone this repo by running
```bash

git clone https://github.com/scorelab/TensorMap.git
```````````````````````````

### Setting up Frontend

#### Prerequisites
* Node.js
* Yarn
* Npm

```bash
cd TensorMap
cd tensormap-client
yarn install
npm start
```

### Setting up Backend

First make sure you have MySQL server and Python 3.x installed in your system.

Then, go into 'tensormap-server' folder

```bash
cd TensorMap
cd tensormap-server
```

Then, install all the required packages by running

```bash
pip install -r requirements.txt
```

Next, login to MySQL and create a database named 'tensormap'

```bash
mysql -u <user> -p
CREATE DATABASE tensormap;
```

Then in the '__init__' file that is inside the 'app' folder, replace the database connection string with your username and password

```bash
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://<user>:<password>@localhost/tensormap"
```

Next, restore the sql dump
```bash
mysql -u {user} -p -Dtensormap < {path-to-dump-file}/dump.sql
```

To start the server run

```bash
python run.py
```

## Built With

* [Reactjs](https://reactjs.org/docs/getting-started.html) : Frontend  
* [Flask](http://flask.pocoo.org/) : Backend
* [TensorFlow - Keras](https://www.tensorflow.org/) : Model implemetation

## Contributing

Please read ['Note to Contributors'](https://github.com/scorelab/TensorMap/wiki/Note-to-Contributors) in project wiki for more details.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/scorelab/TensorMap/blob/master/LICENSE) file for details
