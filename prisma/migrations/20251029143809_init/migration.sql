-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARY');

-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('RESIDENT', 'REGULAR');

-- CreateEnum
CREATE TYPE "ValidityUnit" AS ENUM ('HOURS', 'DAYS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SECRETARY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" "PatientType" NOT NULL DEFAULT 'REGULAR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WifiPassword" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "unit" "ValidityUnit" NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "ssidId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WifiPassword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ssid" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ssid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Ssid_name_key" ON "Ssid"("name");

-- AddForeignKey
ALTER TABLE "WifiPassword" ADD CONSTRAINT "WifiPassword_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WifiPassword" ADD CONSTRAINT "WifiPassword_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WifiPassword" ADD CONSTRAINT "WifiPassword_ssidId_fkey" FOREIGN KEY ("ssidId") REFERENCES "Ssid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ssid" ADD CONSTRAINT "Ssid_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
