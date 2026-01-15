import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始数据种子...');

  // 清理现有数据
  console.log('🧹 清理现有数据...');
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.budget.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.account.deleteMany(),
    prisma.category.deleteMany(),
    prisma.verificationCode.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // 先创建系统用户（用于系统分类）
  console.log('👤 创建系统用户...');
  const systemUser = await prisma.user.create({
    data: {
      email: 'system@smartfinance.com',
      name: 'System',
      password: await bcrypt.hash('system', 10),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // 创建系统分类
  console.log('📁 创建系统分类...');
  
  // 收入分类
  const incomeCategories = [
    { name: '工资收入', type: 'INCOME' as const, color: '#52c41a', icon: '💰' },
    { name: '投资收入', type: 'INCOME' as const, color: '#87d068', icon: '📈' },
    { name: '兼职收入', type: 'INCOME' as const, color: '#95de64', icon: '💼' },
    { name: '奖金收入', type: 'INCOME' as const, color: '#b7eb8f', icon: '🎁' },
    { name: '其他收入', type: 'INCOME' as const, color: '#d9f7be', icon: '📦' },
  ];

  // 支出分类
  const expenseCategories = [
    { name: '餐饮美食', type: 'EXPENSE' as const, color: '#f5222d', icon: '🍔' },
    { name: '交通出行', type: 'EXPENSE' as const, color: '#ff4d4f', icon: '🚗' },
    { name: '购物消费', type: 'EXPENSE' as const, color: '#ff7875', icon: '🛍️' },
    { name: '住房房租', type: 'EXPENSE' as const, color: '#ffa39e', icon: '🏠' },
    { name: '生活缴费', type: 'EXPENSE' as const, color: '#ffccc7', icon: '💡' },
    { name: '娱乐休闲', type: 'EXPENSE' as const, color: '#ff7a45', icon: '🎬' },
    { name: '医疗健康', type: 'EXPENSE' as const, color: '#fa8c16', icon: '🏥' },
    { name: '教育培训', type: 'EXPENSE' as const, color: '#faad14', icon: '📚' },
    { name: '人情往来', type: 'EXPENSE' as const, color: '#ffc53d', icon: '🎁' },
    { name: '其他支出', type: 'EXPENSE' as const, color: '#ffe58f', icon: '📦' },
  ];

  // 创建分类
  const categories = await Promise.all([
    ...incomeCategories.map((cat) =>
      prisma.category.create({
        data: {
          ...cat,
          userId: systemUser.id,
          isSystem: true,
        },
      }),
    ),
    ...expenseCategories.map((cat) =>
      prisma.category.create({
        data: {
          ...cat,
          userId: systemUser.id,
          isSystem: true,
        },
      }),
    ),
  ]);

  console.log(`✅ 创建了 ${categories.length} 个系统分类`);

  // 创建测试用户
  console.log('👤 创建测试用户...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.create({
    data: {
      email: 'test@smartfinance.com',
      phone: '13800138000',
      password: hashedPassword,
      name: '测试用户',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smartfinance.com',
      phone: '13800138001',
      password: hashedPassword,
      name: '管理员',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log(`✅ 创建了 2 个测试用户`);

  // 创建测试账户
  console.log('🏦 创建测试账户...');
  
  const accounts = await Promise.all([
    // 现金账户
    prisma.account.create({
      data: {
        userId: testUser.id,
        name: '现金钱包',
        type: 'CASH',
        balance: 5000.00,
        initialBalance: 5000.00,
        icon: '💰',
        description: '日常现金支出',
        isDefault: true,
        status: 'ACTIVE',
      },
    }),
    
    // 银行账户
    prisma.account.create({
      data: {
        userId: testUser.id,
        name: '招商银行储蓄卡',
        type: 'BANK',
        balance: 25000.00,
        initialBalance: 25000.00,
        color: '#1890ff',
        icon: '🏦',
        description: '工资卡',
        bankName: '招商银行',
        accountNumber: '6225888888888888',
        status: 'ACTIVE',
      },
    }),
    
    // 信用卡
    prisma.account.create({
      data: {
        userId: testUser.id,
        name: '建设银行信用卡',
        type: 'CREDIT_CARD',
        balance: -1500.00,
        initialBalance: 0.00,
        color: '#f5222d',
        icon: '💳',
        description: '日常消费信用卡',
        bankName: '建设银行',
        cardNumber: '5188888888888888',
        cardHolder: testUser.name,
        creditLimit: 20000.00,
        billingDay: 1,
        dueDay: 20,
        status: 'ACTIVE',
      },
    }),
    
    // 电子钱包
    prisma.account.create({
      data: {
        userId: testUser.id,
        name: '支付宝余额',
        type: 'DIGITAL_WALLET',
        balance: 3000.00,
        initialBalance: 3000.00,
        color: '#1677ff',
        icon: '📱',
        description: '支付宝余额',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log(`✅ 创建了 ${accounts.length} 个测试账户`);

  // 创建测试交易记录
  console.log('💸 创建测试交易记录...');
  
  const today = new Date();
  const transactions = [];
  
  // 创建过去30天的交易记录
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 随机选择账户和分类
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // 随机金额（50-500元）
    const amount = Math.random() * 450 + 50;
    
    // 随机交易类型（80%支出，20%收入）
    const type = Math.random() < 0.8 ? 'EXPENSE' : 'INCOME';
    
    const transaction = await prisma.transaction.create({
      data: {
        userId: testUser.id,
        type: type,
        status: 'COMPLETED',
        amount: amount,
        accountId: account.id,
        categoryId: category.id,
        transactionDate: date,
        description: `${type === 'EXPENSE' ? '消费' : '收入'}记录 ${i + 1}`,
        location: '北京市',
        tags: '测试,示例',
      },
    });
    
    transactions.push(transaction);
  }

  console.log(`✅ 创建了 ${transactions.length} 条测试交易记录`);

  // 创建测试预算
  console.log('📊 创建测试预算...');
  
  const budgets = await Promise.all([
    // 餐饮预算
    prisma.budget.create({
      data: {
        userId: testUser.id,
        categoryId: categories.find(c => c.name === '餐饮美食')?.id,
        name: '月度餐饮预算',
        period: 'MONTHLY',
        amount: 2000.00,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        spentAmount: 1500.00,
        remainingAmount: 500.00,
      },
    }),
    
    // 交通预算
    prisma.budget.create({
      data: {
        userId: testUser.id,
        categoryId: categories.find(c => c.name === '交通出行')?.id,
        name: '月度交通预算',
        period: 'MONTHLY',
        amount: 1000.00,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        spentAmount: 800.00,
        remainingAmount: 200.00,
      },
    }),
    
    // 购物预算
    prisma.budget.create({
      data: {
        userId: testUser.id,
        categoryId: categories.find(c => c.name === '购物消费')?.id,
        name: '月度购物预算',
        period: 'MONTHLY',
        amount: 3000.00,
        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        spentAmount: 2500.00,
        remainingAmount: 500.00,
      },
    }),
  ]);

  console.log(`✅ 创建了 ${budgets.length} 个测试预算`);

  // 创建测试通知
  console.log('🔔 创建测试通知...');
  
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'TRANSACTION_CREATED',
        title: '交易记录创建成功',
        content: '您刚刚创建了一笔新的交易记录：餐饮消费 ¥88.00',
        status: 'UNREAD',
      },
    }),
    
    prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'BUDGET_EXCEEDED',
        title: '预算提醒',
        content: '您的餐饮预算已使用 75%，请注意控制消费',
        status: 'UNREAD',
      },
    }),
    
    prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'SYSTEM_ANNOUNCEMENT',
        title: '系统更新通知',
        content: '智能记账助手已升级到 v1.0.0 版本，新增了AI分类功能',
        status: 'READ',
        readAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ 创建了 ${notifications.length} 条测试通知`);

  // 创建测试账单（注释掉，因为 schema 中没有 bill 模型）
  // console.log('📅 创建测试账单...');
  const bills: any[] = [];
  // console.log(`✅ 创建了 ${bills.length} 张测试账单`);

  console.log('🎉 数据种子完成！');
  console.log('');
  console.log('📊 数据统计:');
  console.log(`  用户: 2 个`);
  console.log(`  分类: ${categories.length} 个`);
  console.log(`  账户: ${accounts.length} 个`);
  console.log(`  交易: ${transactions.length} 条`);
  console.log(`  预算: ${budgets.length} 个`);
  console.log(`  通知: ${notifications.length} 条`);
  // console.log(`  账单: ${bills.length} 张`);
  console.log('');
  console.log('🔑 测试用户登录信息:');
  console.log(`  邮箱: test@smartfinance.com`);
  console.log(`  密码: password123`);
  console.log('');
  console.log('🔑 管理员登录信息:');
  console.log(`  邮箱: admin@smartfinance.com`);
  console.log(`  密码: password123`);
  console.log('');
  console.log('🚀 现在可以启动应用进行测试了！');
}

main()
  .catch((e) => {
    console.error('❌ 数据种子失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
