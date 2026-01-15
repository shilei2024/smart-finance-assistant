import { useMemo } from 'react';
import { Card, Space, Typography, Tag, Button, Descriptions, Spin, Alert, Divider, Flex } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, DatabaseOutlined, CloudOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { healthAPI, type HealthResponse } from '../../../api/health';

const { Title, Text } = Typography;

const getTag = (status: 'ok' | 'error', label: string) => (
  <Tag
    color={status === 'ok' ? 'green' : 'red'}
    icon={status === 'ok' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
    style={{ padding: '4px 10px', fontSize: 13 }}
  >
    {label}
  </Tag>
);

const HealthCheck = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<HealthResponse>(
    ['health-status'],
    () => healthAPI.getHealth(),
    {
      refetchOnWindowFocus: false,
    },
  );

  const overall = data?.status === 'ok';

  const serviceRows = useMemo(
    () => [
      {
        key: 'database',
        label: '数据库 (Postgres)',
        icon: <DatabaseOutlined />,
        status: data?.services?.database?.status,
        message: data?.services?.database?.message,
      },
      {
        key: 'redis',
        label: '缓存 (Redis)',
        icon: <CloudOutlined />,
        status: data?.services?.redis?.status,
        message: data?.services?.redis?.message,
      },
    ],
    [data?.services?.database?.message, data?.services?.database?.status, data?.services?.redis?.message, data?.services?.redis?.status],
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            系统健康检查
          </Title>
          <Text type="secondary">检查后端、数据库与Redis的连通性和运行状态</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          loading={isFetching}
          type="default"
        >
          重新检查
        </Button>
      </Flex>

      {error && (
        <Alert
          type="error"
          showIcon
          message="请求健康检查失败"
          description={(error as any)?.message || '请确认后端已启动'}
        />
      )}

      <Card
        bordered
        bodyStyle={{ padding: 20 }}
        title={getTag(overall ? 'ok' : 'error', overall ? '服务正常' : '存在异常')}
        extra={<Text type="secondary">更新时间：{data?.timestamp ? new Date(data.timestamp).toLocaleString() : '--'}</Text>}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="运行时长">
              {data ? `${Math.floor(data.uptime)} 秒` : '--'}
            </Descriptions.Item>
            {serviceRows.map((service) => (
              <Descriptions.Item key={service.key} label={
                <Space align="center">
                  {service.icon}
                  <span>{service.label}</span>
                </Space>
              }>
                <Space align="center">
                  {getTag(service.status || 'error', service.status === 'ok' ? '正常' : '异常')}
                  {service.message && <Text type="secondary">{service.message}</Text>}
                </Space>
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Card>

      <Divider style={{ margin: '8px 0 0' }} />
      <Text type="secondary">
        提示：如果数据库或Redis检查失败，请确认 Docker Compose 已启动对应服务，且前后端指向的主机/端口与 Compose 设置一致。
      </Text>
    </Space>
  );
};

export default HealthCheck;
