import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Google Fontsの設定を有効化
        '@next/font/google': {
          loaders: ['default']
        }
      }
    }
  }
}

export default nextConfig
