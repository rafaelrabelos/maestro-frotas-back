-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 07, 2021 at 02:14 AM
-- Server version: 5.7.33
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `maestro-frotas`
--

-- --------------------------------------------------------

--
-- Table structure for table `recovery`
--

CREATE TABLE `recovery` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_date` datetime NOT NULL,
  `code` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recovery`
--

INSERT INTO `recovery` (`id`, `user_id`, `created_at`, `valid_date`, `code`) VALUES
(9, 2, '2021-04-06 04:45:50', '2021-04-06 06:45:50', '950392'),
(278, 1, '2021-04-06 07:11:37', '2021-04-06 09:11:37', '743571');

--
-- Triggers `recovery`
--
DELIMITER $$
CREATE TRIGGER `recover-code` BEFORE INSERT ON `recovery` FOR EACH ROW BEGIN
	SET NEW.valid_date = DATE_ADD(NOW(), INTERVAL 2 HOUR),
	NEW.code = floor(rand()*900000)+100000;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(100) NOT NULL DEFAULT 'role',
  `root_role` bit(1) NOT NULL DEFAULT b'0',
  `adm_role` bit(1) NOT NULL DEFAULT b'0',
  `user_role` bit(1) NOT NULL DEFAULT b'0',
  `sys_role` bit(1) NOT NULL DEFAULT b'0',
  `active_role` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `root_role`, `adm_role`, `user_role`, `sys_role`, `active_role`) VALUES
(1, 'adm', b'0', b'1', b'1', b'0', b'1'),
(2, 'user', b'0', b'0', b'1', b'0', b'1'),
(3, 'root', b'1', b'0', b'1', b'0', b'1'),
(4, 'sys', b'0', b'0', b'0', b'1', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `nome` varchar(100) DEFAULT NULL,
  `sobrenome` varchar(100) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `cpf` varchar(12) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `role` bigint(20) NOT NULL DEFAULT '0',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `criado_por` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`nome`, `sobrenome`, `data_nascimento`, `cpf`, `senha`, `role`, `criado_em`, `criado_por`, `id`, `email`) VALUES
('Rafael', 'A. Rabelo', '1985-05-20', '07919048656', '$2b$10$/KrhJUdSclmL6BUsYxX9POjaaHJW4jkBk9r6Yu8J3PFq4kvFbyRyu', 3, '2021-04-05 23:02:07', NULL, 1, 'rafael_rabelo@live.com'),
('Tester', 'S. teste', '1985-05-20', '07940044664', '123123', 2, '2021-04-05 23:04:03', NULL, 2, 'rafaelderabelo@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `recovery`
--
ALTER TABLE `recovery`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recovery_UN` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Users_un` (`cpf`),
  ADD KEY `users_roles_FK` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `recovery`
--
ALTER TABLE `recovery`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=279;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recovery`
--
ALTER TABLE `recovery`
  ADD CONSTRAINT `recovery_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_roles_FK` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
