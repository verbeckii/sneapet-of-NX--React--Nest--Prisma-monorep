// PROXY CONFIGURATION FOR XOVIS IBEX V5 CONNECTIONS
import { createProxyMiddleware } from 'http-proxy-middleware';

const xovisProxy = [
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
];

export const createProxy = app => xovisProxy.forEach(proxy => app.use(proxy.source, createProxyMiddleware(proxy)));
