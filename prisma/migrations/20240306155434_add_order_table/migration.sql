-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password` VARCHAR(191) NOT NULL,
    `user_first_name` VARCHAR(191) NOT NULL,
    `user_last_name` VARCHAR(191) NOT NULL,
    `user_createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `payment_method_id` VARCHAR(191) NOT NULL,
    `payment_method_user_id` INTEGER NOT NULL,
    `paymet_method_number` INTEGER NOT NULL,
    `payment_method_name` VARCHAR(191) NOT NULL,
    `payment_method_type` VARCHAR(191) NOT NULL,
    `payment_method_expiration_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`payment_method_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `product_price` DOUBLE NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrier` (
    `carrier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `carrier_name` VARCHAR(191) NOT NULL,
    `carrier_phone` VARCHAR(191) NOT NULL,
    `carrier_email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`carrier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_delivery` (
    `status_delivery_id` INTEGER NOT NULL AUTO_INCREMENT,
    `status_delivery_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`status_delivery_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movieDB_API_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data` JSON NOT NULL,
    `contollerType` ENUM('generator', 'genres', 'movieById', 'MovieByCategory', 'relatedMovies', 'searchMovies', 'trendingMovies', 'trendingMoviesList') NOT NULL,
    `query` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `order_id` INTEGER NOT NULL,
    `order_product_id` INTEGER NOT NULL,
    `order_quantity` INTEGER NOT NULL,
    `order_total` DOUBLE NOT NULL,
    `order_createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `order_user_id` INTEGER NOT NULL,
    `order_carrier_id` INTEGER NOT NULL,
    `order_address` VARCHAR(191) NOT NULL,
    `order_city` VARCHAR(191) NOT NULL,
    `order_country` VARCHAR(191) NOT NULL,
    `order_postal_code` VARCHAR(191) NOT NULL,
    `order_tracking_number` VARCHAR(191) NOT NULL,
    `order_status_id` INTEGER NOT NULL,
    `order_date` DATETIME(3) NOT NULL,
    `order_shipment_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
