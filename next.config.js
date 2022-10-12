import { ENV } from './src/shared/constants/environment';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: ENV,
  sassOptions: {
    additionalData: `@import "~src/shared/styles/index.scss";`,
  },
};

module.exports = nextConfig;
