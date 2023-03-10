import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  minify: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm', 'iife'],
  legacyOutput: true,
})
