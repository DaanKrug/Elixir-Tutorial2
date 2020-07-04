
CREATE TABLE `loggedusers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `auditingExclusions` tinyint(1) NOT NULL DEFAULT 0,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `loggedusers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `loggedusers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;




CREATE TABLE `logintentatives` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` tinyint(4) NOT NULL DEFAULT 0,
  `time` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `logintentatives`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `logintentatives_email_unique` (`email`);

ALTER TABLE `logintentatives`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;



  
CREATE TABLE `accesscontrol` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `resource` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `accesscontrol`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `accesscontrol`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;




COMMIT;
