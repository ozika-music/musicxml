import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  // ponytail: ESM-only. A CJS build tripped over fast-xml-builder's broken
  // default-export interop; every consumer here is ESM. Add 'cjs' back only if
  // a real CJS consumer appears (and then fix the dep interop).
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',
  // Deps stay external (declared in package.json dependencies); only our own
  // src/ is bundled, which resolves the extensionless relative imports.
});
