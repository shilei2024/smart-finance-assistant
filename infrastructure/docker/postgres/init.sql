-- 智能记账助手数据库初始化脚本
-- 创建时间: $(date)

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 设置时区
SET timezone = 'Asia/Shanghai';

-- 创建模式（如果需要）
-- CREATE SCHEMA IF NOT EXISTS finance;

-- 设置搜索路径
-- SET search_path TO finance, public;

-- 创建枚举类型
DO $$ 
BEGIN
    -- 用户角色枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'premium_user', 'admin', 'super_admin');
    END IF;

    -- 交易类型枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
    END IF;

    -- 交易状态枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'cancelled', 'failed');
    END IF;

    -- 账户类型枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE account_type AS ENUM ('cash', 'bank', 'credit_card', 'digital_wallet', 'investment', 'loan');
    END IF;

    -- 预算周期枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'budget_period') THEN
        CREATE TYPE budget_period AS ENUM ('daily', 'weekly', 'monthly', 'yearly', 'custom');
    END IF;

    -- 通知类型枚举
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM (
            'transaction_created',
            'budget_exceeded',
            'bill_reminder',
            'security_alert',
            'system_announcement'
        );
    END IF;
END $$;

-- 创建函数：更新时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建函数：软删除
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.is_deleted = true;
    NEW.deleted_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建函数：生成随机字符串
CREATE OR REPLACE FUNCTION generate_random_string(length integer)
RETURNS text AS $$
DECLARE
    chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
    result text := '';
    i integer := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：计算年龄
CREATE OR REPLACE FUNCTION calculate_age(birth_date date)
RETURNS integer AS $$
BEGIN
    RETURN date_part('year', age(birth_date));
END;
$$ LANGUAGE plpgsql;

-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE '数据库初始化完成！';
    RAISE NOTICE '时区: %', current_setting('TIMEZONE');
    RAISE NOTICE '数据库: smart_finance';
    RAISE NOTICE '用户: admin';
END $$;
