import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';
import Organization from '@/components/Organization';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Text strong>
        欢迎你
      </Typography.Text>
      <Organization />
    </Card>
  </PageContainer>
);
