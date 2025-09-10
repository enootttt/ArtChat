// 导入 Vue 插件，用于处理 .vue 文件
import vue from '@vitejs/plugin-vue'
// 导入 Vite 配置函数
import { defineConfig } from 'vite'
// 导入 TypeScript 声明文件生成插件
import dts from 'vite-plugin-dts'
// 导入 Rollup 输出配置类型
import type { OutputOptions } from 'rollup'

// Rollup 公共配置：定义构建输出的基本配置
const rollupOutputBase: OutputOptions = {
  // 配置资产文件的命名策略
  assetFileNames: (assetInfo) => {
    // CSS 文件统一命名为 index.css
    if (assetInfo.name?.endsWith('.css')) {
      return 'index.css'
    }
    return assetInfo.name as string
  },
  // 入口文件命名格式
  entryFileNames: '[name].js',
  // 禁用动态导入内联
  inlineDynamicImports: false,
  // 不指定手动分块策略
  manualChunks: undefined,
  // 保留模块结构
  preserveModules: true,
  // 设置模块根目录为 packages
  preserveModulesRoot: 'packages',
  // 使用命名导出
  exports: 'named',
}

// 导出 Vite 配置
export default defineConfig(() => {
  return {
    // 构建配置
    build: {
      // 禁用 CSS 代码分割，将所有 CSS 合并到一个文件
      cssCodeSplit: false,
      // 库模式配置
      lib: {
        // 指定库的入口文件
        entry: './src/index.ts',
        // 输出文件名格式
        fileName: (format) => `artmate-chat.${format}.js`,
        // 库的全局变量名
        name: 'ArtmateChat',
      },
      // Rollup 配置选项
      rollupOptions: {
        // 外部依赖，不会被打包进库
        external: ['vue', 'element-plus', '@element-plus/icons-vue'],
        // 输出配置
        output: [
          {
            // 继承基础配置
            ...rollupOutputBase,
            // ES 模块输出目录
            dir: 'dist/es',
            // 输出格式为 ES 模块
            format: 'es',
          },
          {
            // 继承基础配置
            ...rollupOutputBase,
            // CommonJS 输出目录
            dir: 'dist/cjs',
            // 输出格式为 CommonJS
            format: 'cjs',
          },
        ],
      },
    },
    // 插件配置
    plugins: [
      // Vue 插件，处理 .vue 文件
      vue(),
      // 生成 TypeScript 声明文件
      dts({
        // TypeScript 声明的根目录
        entryRoot: './src',
        // TypeScript 声明文件输出目录
        outDir: ['dist/typings'],
      }),
    ],
  }
})
