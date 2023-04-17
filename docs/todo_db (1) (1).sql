-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 17, 2023 at 05:32 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `emailVerificationToken` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `email`, `pincode`, `is_deleted`, `is_verified`, `emailVerificationToken`, `is_admin`) VALUES
(1, 'maxence.allart@gmail.com', '0AXl.DoXxV3A1Ufda0mNyO8Y8J7AyzEQUcyNzb56wPC..ZTssXWDm', 0, 1, '', 1),
(43, 'maxoa59@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 0),
(44, 'testcompte1@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 0),
(45, 'testadmincompte1@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 1),
(46, 'testadmincompte2@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 1),
(47, 'testadmincompte3@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 1),
(48, 'testcompte2@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 0),
(49, 'testcompte3@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 0),
(50, 'testcompte4@gmail.com', 'CGvFCAJEjUMTTSUfY2SeYOBH16z2linrG5iaUh1HUtnK7WWF7ujFe', 0, 1, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `priority`
--

DROP TABLE IF EXISTS `priority`;
CREATE TABLE IF NOT EXISTS `priority` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `priority`
--

INSERT INTO `priority` (`id`, `label`, `color`, `is_deleted`) VALUES
(1, 'Haute', '#F62E36', 0),
(2, 'Normale', '#F39700', 0),
(3, 'Basse', '#019A66', 0);

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `deadline_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `id_priority` int NOT NULL DEFAULT '2',
  `id_Todo` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_priority` (`id_priority`),
  KEY `id_Todo` (`id_Todo`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `title`, `description`, `deadline_date`, `is_completed`, `is_deleted`, `id_priority`, `id_Todo`) VALUES
(1, 'Viandes et légumeszzz', 'new test', '2023-06-22 14:41:58', 0, 0, 1, 1),
(2, 'Nourriture pour le chien', 'Croquettes et bonbons chien.', '0000-00-00 00:00:00', 1, 0, 2, 1),
(3, 'Plein de surgeles', 'Frittes steaks et co', '2023-11-16 06:57:56', 1, 0, 3, 1),
(4, 'eros', 'Phasellus in felis. Donec semper sapien a libero.', '2023-10-23 12:57:21', 0, 0, 3, 2),
(5, 'viverra diam vitae', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', '2023-06-25 14:55:35', 0, 0, 1, 2),
(6, 'nec dui', 'Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '2023-04-10 11:36:23', 1, 0, 3, 1),
(7, 'a libero', 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', '0000-00-00 00:00:00', 1, 0, 3, 1),
(8, 'ante', 'Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.', '2023-12-03 13:07:52', 0, 0, 2, 3),
(9, 'eu orci', 'Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl.', '2023-06-25 00:37:36', 0, 0, 2, 3),
(10, 'quis tortor id', 'Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo.', '2023-12-05 12:23:54', 0, 0, 1, 2),
(11, 'ligula', 'In congue. Etiam justo. Etiam pretium iaculis justo.', '2023-05-20 00:20:19', 1, 0, 3, 3),
(12, 'mi in', 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam.', '2023-01-25 16:57:27', 1, 1, 2, 2),
(13, 'montes nascetur ridiculus', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis.', '2023-04-18 09:57:24', 1, 1, 3, 2),
(14, 'in leo', 'Integer ac leo.', '2023-06-10 23:22:38', 0, 1, 3, 1),
(15, 'tellus in sagittis', 'Nulla mollis molestie lorem. Quisque ut erat.', '2023-09-26 09:41:22', 1, 0, 3, 3),
(16, 'sit', 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', '2023-07-10 10:16:02', 1, 0, 2, 3),
(17, 'elementum eu interdum', 'Aliquam erat volutpat. In congue.', '2023-05-24 12:51:16', 0, 1, 1, 2),
(18, 'rutrum nulla', 'Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum.', '2023-01-06 20:20:32', 0, 0, 2, 2),
(19, 'ut blandit', 'In sagittis dui vel nisl.', '2023-09-23 08:20:30', 1, 0, 3, 2),
(20, 'porttitor', 'Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor.', '2023-11-15 10:19:49', 0, 1, 3, 2),
(21, 'nullam orci', 'Pellentesque ultrices mattis odio. Donec vitae nisi.', '2023-04-11 04:59:49', 0, 1, 3, 1),
(22, 'tristique fusce congue', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', '2023-06-24 05:57:01', 0, 1, 1, 3),
(23, 'purus aliquet at', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.', '2023-03-17 06:51:35', 1, 1, 2, 1),
(24, 'congue etiam', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', '2023-02-27 04:08:38', 0, 1, 3, 3),
(25, 'aenean fermentum', 'Cras non velit nec nisi vulputate nonummy.', '2023-02-21 15:41:56', 0, 1, 1, 3),
(26, 'maecenas', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum.', '2023-11-27 03:20:16', 0, 1, 2, 1),
(27, 'sed', 'Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl.', '2023-11-13 21:58:20', 1, 1, 1, 1),
(28, 'ut', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '2023-09-24 07:42:56', 1, 0, 1, 2),
(29, 'faucibus', 'Cras non velit nec nisi vulputate nonummy.', '2023-02-11 12:05:28', 1, 1, 1, 1),
(30, 'id ligula suspendisse', 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.', '2023-10-04 21:26:25', 0, 1, 1, 2),
(31, 'PostTEST', 'test post', '2023-02-06 14:45:29', 0, 1, 2, 1),
(32, 'PostTEST', 'test post', '2023-02-06 14:46:58', 0, 1, 2, 1),
(34, 'titiel lau', 'methode laurent', '2023-02-06 15:47:32', 0, 0, 2, 2),
(56, 'New task test', 'Avec todo id = 15', '2023-06-24 10:41:58', 0, 0, 2, 15),
(57, 'Test Task title', 'Test task description', '2023-06-24 10:41:58', 0, 1, 1, 1),
(58, 'Test Task title2', 'Test task description2', '2023-04-04 21:36:03', 0, 1, 2, 1),
(59, 'modal test', 'modal desc', '0000-00-00 00:00:00', 0, 1, 2, 1),
(60, 'date test 1', 'date test 11', '2023-04-01 00:00:00', 0, 1, 2, 1),
(61, 'yo date teest 2', 'test date 2', '2023-04-05 03:08:00', 0, 1, 2, 1),
(62, 'test date', 'test tdateeee', '2023-04-06 06:54:00', 0, 1, 3, 1),
(63, 'test date 2', 'test tdateeee 222', '2023-04-06 03:54:00', 0, 1, 3, 1),
(64, 'test date 2', 'test tdateeee 222', '2023-04-05 03:54:00', 0, 1, 3, 1),
(65, 'progress bar test', 'progress test', '2023-04-21 05:20:00', 0, 1, 1, 1),
(66, 'yo', 'yoooooooo', '2023-04-05 20:56:00', 0, 1, 2, 1),
(67, 'yoooo', 'yooooo', '2023-04-06 19:12:00', 0, 1, 2, 1),
(68, 'yoooo', 'yooooo', '2023-04-06 19:12:00', 0, 1, 2, 1),
(69, 'toto', 'tata', '2023-04-06 20:20:00', 0, 1, 2, 1),
(70, 'yoyo', 'yaya', '2023-04-07 19:23:00', 0, 1, 2, 1),
(71, 'zeze', 'ezez', '2023-04-05 19:45:00', 0, 1, 2, 1),
(72, 'testpercent', 'test', '2023-04-05 21:38:00', 0, 0, 2, 15),
(73, 'testpercent2', 'test2', '2023-04-05 21:38:00', 0, 0, 2, 15),
(74, 'Ma première tache', 'tout tester !', '2023-04-07 12:45:00', 1, 1, 2, 29),
(75, 'Ma seconde tache', 'tout tester encore !', '2023-06-11 14:45:00', 1, 1, 2, 29),
(76, 'First task de la first todo', 'lets go', '0000-00-00 00:00:00', 1, 0, 3, 30),
(77, 'Second task de la first todo', 'yo', '0000-00-00 00:00:00', 1, 0, 2, 30),
(78, 'first task de la todo2', 'toto', '0000-00-00 00:00:00', 0, 0, 2, 31),
(79, 'second task de la todo2', 'tata', '0000-00-00 00:00:00', 0, 0, 2, 31),
(80, 'task', 'desc', '2023-04-12 20:51:00', 0, 0, 1, 35);

-- --------------------------------------------------------

--
-- Table structure for table `todo`
--

DROP TABLE IF EXISTS `todo`;
CREATE TABLE IF NOT EXISTS `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_favorite` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `id_customer` int NOT NULL DEFAULT '0',
  `is_completed` int NOT NULL DEFAULT '0',
  `url_img` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_customer` (`id_customer`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `todo`
--

INSERT INTO `todo` (`id`, `title`, `description`, `is_favorite`, `is_deleted`, `id_customer`, `is_completed`, `url_img`) VALUES
(1, 'Courses Test ', 'Faire les courses de la semaine !', 1, 0, 1, 50, '1681218900423-IMG_20200620_221739.jpg'),
(2, 'Travail', '', 1, 1, 1, 0, ''),
(3, 'Divers', 'A faire quand j\'ai l\'temps', 0, 1, 1, 75, ''),
(12, 'Diverses choses', 'A plus tard', 0, 0, 2, 0, ''),
(13, 'Que faire', 'Ttotooo', 0, 0, 2, 0, ''),
(14, 'Another todo', 'Description todo', 0, 1, 1, 20, ''),
(15, 'Courses 2', 'Liste des courses du mois.', 0, 0, 1, 100, '1681222381826-20230324_220223.jpg'),
(27, 'trarara', 'tttt', 0, 1, 1, 0, ''),
(28, 'Test todo', 'test descr', 0, 1, 1, 0, ''),
(29, 'Ma première TODO !', 'Youhou ça marche !', 1, 1, 43, 0, ''),
(30, 'First todo', 'goooo', 1, 0, 43, 0, '1681220877652-IMG_20211210_160121.jpg'),
(31, 'Second todo', 'toto', 0, 0, 43, 0, '1681240889033-IMG_20200603_171628.jpg'),
(32, 'new todo 3', 'test', 0, 1, 43, 0, ''),
(33, 'tata', 'toto', 0, 1, 1, 0, ''),
(34, 'Courses Test ', 'Faire les courses de la semaine !', 1, 1, 1, 50, ''),
(35, 'yoyo', 'tata', 0, 0, 1, 0, '1681219064514-IMG_20211210_160121.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
CREATE TABLE IF NOT EXISTS `uploads` (
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
