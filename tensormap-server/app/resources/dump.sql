-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tensormap
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `code_layers`
--
DROP TABLE IF EXISTS `dataset`;

CREATE TABLE `dataset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `filePath` varchar(1000) DEFAULT NULL,
  `fileFormat` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `code_layers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `code_layers` (
  `name` varchar(255) NOT NULL,
  `code` varchar(500) DEFAULT NULL,
  `attributes` varchar(500) DEFAULT NULL,
  `kerasConfig` json DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_layers`
--

LOCK TABLES `code_layers` WRITE;
/*!40000 ALTER TABLE `code_layers` DISABLE KEYS */;
INSERT INTO `code_layers` VALUES ('compile','network.compile (','optimizer,loss',NULL),('dense','network.add(tf.keras.layers.Dense(','units,activation,name','{\"config\": {\"name\": \"dense_1\", \"dtype\": \"float32\", \"units\": 128, \"use_bias\": true, \"trainable\": true, \"activation\": \"relu\", \"bias_constraint\": null, \"bias_initializer\": {\"config\": {\"dtype\": \"float32\"}, \"class_name\": \"Zeros\"}, \"bias_regularizer\": null, \"kernel_constraint\": null, \"kernel_initializer\": {\"config\": {\"seed\": null, \"dtype\": \"float32\"}, \"class_name\": \"GlorotUniform\"}, \"kernel_regularizer\": null, \"activity_regularizer\": null}, \"class_name\": \"Dense\"}'),('fit','network.fit (','epochs,verbose,batch_size',NULL),('readcsv','dataCsv = pd.read_csv (',NULL,NULL),('train_test_split','x_train, y_train, x_test, y_test = train_test_split (','_x,_y,random_state,shuffle,test_size',NULL),('_x','_x = dataCsv[',NULL,NULL),('_y','_y = dataCsv[',NULL,NULL);
/*!40000 ALTER TABLE `code_layers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dataset`
--

DROP TABLE IF EXISTS `dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dataset` (
  `filePath` varchar(1000) DEFAULT NULL,
  `fileName` varchar(50) NOT NULL,
  `fileFormat` varchar(50) DEFAULT NULL,
  `features` varchar(1000) DEFAULT NULL,
  `labels` varchar(1000) DEFAULT NULL,
  `testPercentage` int(11) DEFAULT NULL,
  PRIMARY KEY (`fileName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dataset`
--

LOCK TABLES `dataset` WRITE;
/*!40000 ALTER TABLE `dataset` DISABLE KEYS */;
/*!40000 ALTER TABLE `dataset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_copies`
--

DROP TABLE IF EXISTS `template_copies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template_copies` (
  `id` varchar(50) NOT NULL,
  `fileName` varchar(50) NOT NULL,
  `data` blob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_copies`
--

LOCK TABLES `template_copies` WRITE;
/*!40000 ALTER TABLE `template_copies` DISABLE KEYS */;
/*!40000 ALTER TABLE `template_copies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_template_index`
--

DROP TABLE IF EXISTS `user_template_index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_template_index` (
  `lineNo` int(11) DEFAULT NULL,
  `layerId` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_template_index`
--

LOCK TABLES `user_template_index` WRITE;
/*!40000 ALTER TABLE `user_template_index` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_template_index` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-19 20:15:10
