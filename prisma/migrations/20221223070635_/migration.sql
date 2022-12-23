-- CreateTable
CREATE TABLE `links` (
    `id` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `links_hash_key`(`hash`),
    UNIQUE INDEX `links_alias_key`(`alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
