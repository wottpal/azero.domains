/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  trailingSlash: true,
  ...(process?.env?.NODE_ENV === 'production' ? { assetPrefix: './' } : {}),
}

module.exports = nextConfig
