-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-05-2025 a las 07:28:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `colegio_asistencia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id` int(11) NOT NULL,
  `docente_id` int(11) DEFAULT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `fecha_hora` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id`, `docente_id`, `tipo`, `fecha_hora`) VALUES
(1, 1, 'entrada', '2025-05-23 23:47:36'),
(2, 1, 'salida', '2025-05-23 23:47:39'),
(3, 1, 'entrada', '2025-05-23 23:47:41'),
(4, 1, 'salida', '2025-05-23 23:47:42'),
(5, 1, 'entrada', '2025-05-23 23:47:43'),
(6, 1, 'salida', '2025-05-23 23:47:44'),
(7, 1, 'entrada', '2025-05-23 23:47:44'),
(8, 1, 'salida', '2025-05-23 23:48:17'),
(9, 1, 'entrada', '2025-05-23 23:48:20'),
(10, 1, 'salida', '2025-05-23 23:54:12'),
(11, 1, 'entrada', '2025-05-23 23:54:51'),
(12, 1, 'salida', '2025-05-23 23:54:59'),
(13, 1, 'entrada', '2025-05-23 23:55:29'),
(14, 1, 'salida', '2025-05-23 23:55:39'),
(15, 1, 'entrada', '2025-05-23 23:55:49'),
(16, 1, 'salida', '2025-05-23 23:57:04'),
(17, 1, 'entrada', '2025-05-23 23:57:14'),
(18, 1, 'salida', '2025-05-23 23:59:25'),
(19, 1, 'entrada', '2025-05-23 23:59:43'),
(20, 1, 'salida', '2025-05-23 23:59:54'),
(21, 1, 'entrada', '2025-05-24 00:00:06'),
(22, 1, 'salida', '2025-05-24 00:00:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

CREATE TABLE `docentes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `nombre`, `dni`, `correo`, `celular`, `foto`) VALUES
(1, 'Ian Gabriel Zuñiga Solano', '75430965', 'xzyanzx.zz@gmail.com', '925976376', 'uploads\\75430965_Gabo.jpg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente_id` (`docente_id`);

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
