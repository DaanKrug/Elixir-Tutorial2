

CREATE TABLE `applog` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `userName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userEmail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `operation` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `objTitle` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `ffrom` mediumtext COLLATE utf8mb4_general_ci NOT NULL,
  `tto` mediumtext COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `applog`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `applog`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;




COMMIT;
