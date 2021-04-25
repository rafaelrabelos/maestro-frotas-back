-- MariaDB dump 10.18  Distrib 10.4.17-MariaDB, for osx10.10 (x86_64)
--
-- Host: u6354r3es4optspf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: nckimacu5crhmjs1
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `street1` varchar(100) NOT NULL,
  `street2` varchar(100) DEFAULT NULL,
  `number` varchar(100) DEFAULT NULL,
  `city_id` bigint NOT NULL,
  `zip_code` varchar(100) NOT NULL,
  `complement` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `addresses_un` (`id`),
  KEY `addresses_FK` (`city_id`),
  CONSTRAINT `addresses_FK` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `provincie_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_un` (`id`,`provincie_id`),
  KEY `cities_FK` (`provincie_id`),
  CONSTRAINT `cities_FK` FOREIGN KEY (`provincie_id`) REFERENCES `province` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_adresses`
--

DROP TABLE IF EXISTS `client_adresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_adresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_id` bigint NOT NULL,
  `client_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_adresses_un` (`id`,`address_id`),
  KEY `client_adresses_FK` (`address_id`),
  KEY `client_adresses_FK_1` (`client_id`),
  CONSTRAINT `client_adresses_FK` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `client_adresses_FK_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_adresses`
--

LOCK TABLES `client_adresses` WRITE;
/*!40000 ALTER TABLE `client_adresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_adresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_vehicle`
--

DROP TABLE IF EXISTS `client_vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_vehicle` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL,
  `vehicle_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_vehicle_FK` (`client_id`),
  KEY `client_vehicle_FK_1` (`vehicle_id`),
  CONSTRAINT `client_vehicle_FK` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `client_vehicle_FK_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_vehicle`
--

LOCK TABLES `client_vehicle` WRITE;
/*!40000 ALTER TABLE `client_vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(100) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_un` (`id`,`cpf`,`email`),
  KEY `clients_FK` (`created_by`),
  CONSTRAINT `clients_FK` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dial_code` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `timezone_gmt` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `country_un` (`dial_code`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `vehicle_type_id` bigint NOT NULL,
  `vehicle_size_port_id` bigint NOT NULL,
  `fee_id` bigint NOT NULL,
  `daily_value` decimal(10,0) NOT NULL DEFAULT '0',
  `mouthly_value` decimal(10,0) NOT NULL,
  `yarly_value` decimal(10,0) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT 'fee',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fees_un` (`id`),
  KEY `fees_FK` (`fee_id`),
  KEY `fees_FK_1` (`vehicle_type_id`),
  KEY `fees_FK_2` (`vehicle_size_port_id`),
  CONSTRAINT `fees_FK_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`),
  CONSTRAINT `fees_FK_2` FOREIGN KEY (`vehicle_size_port_id`) REFERENCES `vehicle_size_ports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fleet`
--

DROP TABLE IF EXISTS `fleet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fleet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `cnpj` varchar(100) NOT NULL,
  `address_id` bigint NOT NULL,
  `capacity` varchar(100) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fleet_un` (`id`,`cnpj`,`address_id`),
  KEY `fleet_FK` (`address_id`),
  CONSTRAINT `fleet_FK` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fleet`
--

LOCK TABLES `fleet` WRITE;
/*!40000 ALTER TABLE `fleet` DISABLE KEYS */;
/*!40000 ALTER TABLE `fleet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `from_user` bigint NOT NULL,
  `to_user` bigint NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `message` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `delivered` tinyint(1) NOT NULL DEFAULT '0',
  `readed` tinyint(1) NOT NULL DEFAULT '0',
  `replying_message_id` bigint DEFAULT NULL,
  `sent_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `messages_un` (`id`),
  KEY `messages_FK` (`from_user`),
  KEY `messages_FK_1` (`to_user`),
  KEY `messages_FK_2` (`replying_message_id`),
  CONSTRAINT `messages_FK` FOREIGN KEY (`from_user`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_FK_1` FOREIGN KEY (`to_user`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_FK_2` FOREIGN KEY (`replying_message_id`) REFERENCES `messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `province`
--

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `province` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `dial_code` varchar(100) NOT NULL,
  `country_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `province_un` (`id`,`dial_code`),
  KEY `province_FK` (`country_id`),
  CONSTRAINT `province_FK` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `province`
--

LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recovery`
--

DROP TABLE IF EXISTS `recovery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recovery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_date` datetime NOT NULL,
  `code` varchar(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recovery_UN` (`user_id`),
  CONSTRAINT `recovery_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=288 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recovery`
--

LOCK TABLES `recovery` WRITE;
/*!40000 ALTER TABLE `recovery` DISABLE KEYS */;
INSERT INTO `recovery` VALUES (9,2,'2021-04-06 04:45:50','2021-04-06 06:45:50','950392'),(287,1,'2021-04-13 16:28:31','2021-04-13 18:28:31','252219');
/*!40000 ALTER TABLE `recovery` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50003 TRIGGER `recover-code` BEFORE INSERT ON `recovery` FOR EACH ROW BEGIN
	SET NEW.valid_date = DATE_ADD(NOW(), INTERVAL 2 HOUR),
	NEW.code = floor(rand()*900000)+100000;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL DEFAULT 'role',
  `root_role` bit(1) NOT NULL DEFAULT b'0',
  `adm_role` bit(1) NOT NULL DEFAULT b'0',
  `user_role` bit(1) NOT NULL DEFAULT b'0',
  `sys_role` bit(1) NOT NULL DEFAULT b'0',
  `active_role` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'adm','\0','','','\0',''),(2,'user','\0','\0','','\0',''),(3,'root','','\0','','\0',''),(4,'sys','\0','\0','\0','','');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_fleet`
--

DROP TABLE IF EXISTS `user_fleet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_fleet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fleet_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_fleet_un` (`id`),
  KEY `user_fleet_FK` (`user_id`),
  KEY `user_fleet_FK_1` (`role_id`),
  KEY `user_fleet_FK_2` (`fleet_id`),
  CONSTRAINT `user_fleet_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_fleet_FK_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `user_fleet_FK_2` FOREIGN KEY (`fleet_id`) REFERENCES `fleet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_fleet`
--

LOCK TABLES `user_fleet` WRITE;
/*!40000 ALTER TABLE `user_fleet` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_fleet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `nome` varchar(100) DEFAULT NULL,
  `sobrenome` varchar(100) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `cpf` varchar(12) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `role` bigint NOT NULL DEFAULT '0',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `criado_por` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_un` (`cpf`),
  KEY `users_roles_FK` (`role`),
  CONSTRAINT `users_roles_FK` FOREIGN KEY (`role`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Rafael','A. Rabelo','1985-05-20','07919048656','$2b$10$VRky1pa9WLIkwtnIlfOe7.w4NGZKicR/3M.ZHCvYv0h9Q76a6LR9a',3,'2021-04-05 23:02:07',NULL,1,'rafael_rabelo@live.com'),('System','sys','1985-05-20','07919048655','$2b$10$OLq68Pwd5DxZG/0JlbL7tuMDge0q.yAYCxSnm42Iq7xPMp0lg1SNu',4,'2021-04-05 23:04:03',NULL,2,'rafaelderabelo@gmail.com'),('Rafael','',NULL,'07940044664','$2b$10$2gqJ3F2BPQCytxP3WbDMiu9VEq4sQc9rrykTqW4fB9C1URJYT/.NC',1,'2021-04-10 02:46:17',2,3,'tempconnarti@outlook.com'),('Mirella','',NULL,'14048274635','$2b$10$Gbpg304Lf6ttUK8PAMRrI.SlR69ujnAQJQwOWqHeZTlVYS6fDiKdC',2,'2021-04-11 21:35:29',2,4,'mirella.soares@sga.pucminas.br');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_policies`
--

DROP TABLE IF EXISTS `users_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_policies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `black_listed` tinyint(1) NOT NULL DEFAULT '0',
  `date_to_keep_blocked` datetime NOT NULL,
  `user_ip` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_policies_un` (`id`,`user_id`,`user_ip`),
  KEY `users_policies_FK` (`user_id`),
  CONSTRAINT `users_policies_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_policies`
--

LOCK TABLES `users_policies` WRITE;
/*!40000 ALTER TABLE `users_policies` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_size_ports`
--

DROP TABLE IF EXISTS `vehicle_size_ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle_size_ports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_size_ports_un` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_size_ports`
--

LOCK TABLES `vehicle_size_ports` WRITE;
/*!40000 ALTER TABLE `vehicle_size_ports` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_size_ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_types`
--

DROP TABLE IF EXISTS `vehicle_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `wheels_num` varchar(100) NOT NULL,
  `size_port_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicle_types_un` (`id`),
  KEY `vehicle_types_FK` (`size_port_id`),
  CONSTRAINT `vehicle_types_FK` FOREIGN KEY (`size_port_id`) REFERENCES `vehicle_size_ports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_types`
--

LOCK TABLES `vehicle_types` WRITE;
/*!40000 ALTER TABLE `vehicle_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `license_plate` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `manufacture_year` varchar(100) NOT NULL,
  `type` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fleet_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicles_un` (`license_plate`,`id`),
  KEY `vehicles_FK` (`type`),
  KEY `vehicles_FK_1` (`fleet_id`),
  CONSTRAINT `vehicles_FK` FOREIGN KEY (`type`) REFERENCES `vehicle_types` (`id`),
  CONSTRAINT `vehicles_FK_1` FOREIGN KEY (`fleet_id`) REFERENCES `fleet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'nckimacu5crhmjs1'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-22 23:52:46
