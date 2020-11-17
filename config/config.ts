import { defineConfig } from 'umi';
import routes from './routes';
import env from './env';
import webpackPlugin from './webpack';

const { UMI_ENV = 'dev' } = process.env;

export default defineConfig({
  antd: {},
  define: {
    UMI_ENV,
  },
  devServer: {
    port: 3000,
    http2: true,
  },
  dynamicImport: {
    loading: '@/components/page-loading',
  },
  hash: true,
  manifest: {
    basePath: '/',
  },
  mock: false,
  request: false,
  routes,
  targets: {
    ie: 11,
  },
  theme: env.theme,
  title: env.title,
  chainWebpack: webpackPlugin,
});
