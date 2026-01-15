/**
 * 认证功能手动测试脚本
 * 使用方法: node scripts/test-auth.js
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api/v1';

// 测试数据
const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  passwordConfirm: 'password123',
  name: '测试用户',
};

let accessToken = '';
let refreshToken = '';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// 测试函数
async function testRegister() {
  logInfo('测试用户注册...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    if (response.data.success) {
      accessToken = response.data.data.accessToken;
      refreshToken = response.data.data.refreshToken;
      logSuccess(`注册成功！用户ID: ${response.data.data.user.id}`);
      logSuccess(`邮箱: ${response.data.data.user.email}`);
      return true;
    }
  } catch (error) {
    logError(`注册失败: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogin() {
  logInfo('测试用户登录...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    if (response.data.success) {
      accessToken = response.data.data.accessToken;
      refreshToken = response.data.data.refreshToken;
      logSuccess('登录成功！');
      return true;
    }
  } catch (error) {
    logError(`登录失败: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetProfile() {
  logInfo('测试获取用户信息...');
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.success) {
      logSuccess('获取用户信息成功！');
      console.log('用户信息:', JSON.stringify(response.data.data, null, 2));
      return true;
    }
  } catch (error) {
    logError(`获取用户信息失败: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testRefreshToken() {
  logInfo('测试刷新令牌...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    if (response.data.success) {
      accessToken = response.data.data.accessToken;
      refreshToken = response.data.data.refreshToken;
      logSuccess('刷新令牌成功！');
      return true;
    }
  } catch (error) {
    logError(`刷新令牌失败: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testLogout() {
  logInfo('测试登出...');
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/logout`,
      { token: accessToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data.success) {
      logSuccess('登出成功！');
      return true;
    }
  } catch (error) {
    logError(`登出失败: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// 主测试流程
async function runTests() {
  console.log('\n🚀 开始测试认证功能...\n');
  console.log(`API地址: ${API_BASE_URL}\n`);

  const results = {
    register: false,
    login: false,
    getProfile: false,
    refreshToken: false,
    logout: false,
  };

  // 测试注册
  results.register = await testRegister();
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 测试登录（如果注册失败，使用测试邮箱）
  if (!results.register) {
    logInfo('注册失败，尝试使用已有账户登录...');
    testUser.email = 'test@example.com';
  }
  results.login = await testLogin();
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (results.login) {
    // 测试获取用户信息
    results.getProfile = await testGetProfile();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 测试刷新令牌
    results.refreshToken = await testRefreshToken();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 测试登出
    results.logout = await testLogout();
  }

  // 输出测试结果
  console.log('\n📊 测试结果汇总:');
  console.log('─'.repeat(50));
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ 通过' : '❌ 失败';
    console.log(`${test.padEnd(20)} ${status}`);
  });
  console.log('─'.repeat(50));

  const passedCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  console.log(`\n总计: ${passedCount}/${totalCount} 测试通过\n`);

  if (passedCount === totalCount) {
    logSuccess('🎉 所有测试通过！');
  } else {
    logError('⚠️  部分测试失败，请检查API服务是否正常运行');
  }
}

// 运行测试
runTests().catch((error) => {
  logError(`测试执行失败: ${error.message}`);
  process.exit(1);
});
