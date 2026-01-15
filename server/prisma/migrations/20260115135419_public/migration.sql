-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "billingDay" INTEGER,
ADD COLUMN     "cardHolder" TEXT,
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "color" TEXT DEFAULT '#1890ff',
ADD COLUMN     "creditLimit" DOUBLE PRECISION,
ADD COLUMN     "cvv" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dueDay" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "expiryDate" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "interestRate" DOUBLE PRECISION,
ADD COLUMN     "investmentType" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "loanAmount" DOUBLE PRECISION,
ADD COLUMN     "loanTerm" INTEGER,
ADD COLUMN     "riskLevel" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "toAccountId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
