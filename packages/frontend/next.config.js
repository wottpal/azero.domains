/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  trailingSlash: true,
  ...(process?.env?.NEXT_PUBLIC_PRODUCTION_MODE === 'true' ? { assetPrefix: './' } : {}),
}

module.exports = nextConfig
