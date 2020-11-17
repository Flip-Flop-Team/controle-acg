import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';

const PageLoading: React.FC<{ message?: string; showFooter?: boolean }> = ({
  message,
}) => (
  <div className={styles.container}>
    <Spin size="large" />
    <div style={{ marginTop: '24px' }}>{message || 'carregando'}</div>
  </div>
);

export default PageLoading;
