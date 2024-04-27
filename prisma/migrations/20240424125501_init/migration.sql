-- CreateEnum
CREATE TYPE "contollerType" AS ENUM ('generator', 'genres', 'movieById', 'MovieByCategory', 'relatedMovies', 'searchMovies', 'trendingMovies', 'trendingMoviesList');

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_first_name" TEXT NOT NULL,
    "user_last_name" TEXT NOT NULL,
    "user_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "payment_method_id" TEXT NOT NULL,
    "payment_method_user_id" INTEGER NOT NULL,
    "paymet_method_number" INTEGER NOT NULL,
    "payment_method_name" TEXT NOT NULL,
    "payment_method_type" TEXT NOT NULL,
    "payment_method_expiration_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "carrier" (
    "carrier_id" SERIAL NOT NULL,
    "carrier_name" TEXT NOT NULL,
    "carrier_phone" TEXT NOT NULL,
    "carrier_email" TEXT NOT NULL,

    CONSTRAINT "carrier_pkey" PRIMARY KEY ("carrier_id")
);

-- CreateTable
CREATE TABLE "status_delivery" (
    "status_delivery_id" SERIAL NOT NULL,
    "status_delivery_name" TEXT NOT NULL,

    CONSTRAINT "status_delivery_pkey" PRIMARY KEY ("status_delivery_id")
);

-- CreateTable
CREATE TABLE "movieDB_API_responses" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "contollerType" "contollerType" NOT NULL,
    "query" TEXT,

    CONSTRAINT "movieDB_API_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" INTEGER NOT NULL,
    "order_product_id" INTEGER NOT NULL,
    "order_quantity" INTEGER NOT NULL,
    "order_total" DOUBLE PRECISION NOT NULL,
    "order_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_user_id" INTEGER NOT NULL,
    "order_carrier_id" INTEGER NOT NULL,
    "order_address" TEXT NOT NULL,
    "order_city" TEXT NOT NULL,
    "order_country" TEXT NOT NULL,
    "order_postal_code" TEXT NOT NULL,
    "order_tracking_number" TEXT NOT NULL,
    "order_status_id" INTEGER NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "order_shipment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_email_key" ON "user"("user_email");
