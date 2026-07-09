export const appConfig = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  serviceName: process.env.SERVICE_NAME ?? 'cinema-service',
  port: Number(process.env.PORT ?? 3000),
  apiGatewayPort: Number(process.env.API_GATEWAY_PORT ?? process.env.PORT ?? 3000),
});
