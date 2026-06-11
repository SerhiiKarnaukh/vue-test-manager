import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'threads',
    maxWorkers: 1,
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/**/*.{test,spec}.js'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/**/*.spec.js',
        'src/**/*.test.js',
        'src/tests/**',
        'src/main.js',
        'src/plugins/**',
        'src/assets/**',
      ],
      thresholds: {
        'src/utils/authJwtEndpoints.js': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
        'src/utils/error.js': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
        'src/store/modules/authJWT.module.js': {
          lines: 80,
          functions: 60,
          branches: 80,
          statements: 80,
        },
        'src/store/modules/alert.module.js': {
          lines: 85,
          functions: 80,
          branches: 100,
          statements: 85,
        },
        'src/composables/useVuelidateErrorMessages.js': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
        'src/router/guards.js': {
          lines: 85,
          functions: 85,
          branches: 80,
          statements: 85,
        },
        'src/http/axiosInterceptors.js': {
          lines: 85,
          functions: 85,
          branches: 80,
          statements: 85,
        },
      },
    },
  },
})
