// 导入 Vue 插件，用于处理 .vue 文件
import vue from '@vitejs/plugin-vue'
// 导入 Vite 配置函数
import { defineConfig } from 'vite'
// 导入 TypeScript 声明文件生成插件
import dts from 'vite-plugin-dts'

// Rollup 公共配置：定义构建输出的基本配置
const rollupOutputBase = {
  // 配置资产文件的命名策略
  assetFileNames: (assetInfo: { name?: string }) => {
    // CSS 文件统一命名为 index.css
    if (assetInfo.name?.endsWith('.css')) {
      return 'index.css'
    }
    return assetInfo.name as string
  },
  // 入口文件命名格式
  entryFileNames: '[name].js',
  // 保留模块结构
  preserveModules: true,
  // 设置模块根目录为 src
  preserveModulesRoot: 'src',
  // 使用命名导出
  exports: 'named' as 'named',
}

// 导出 Vite 配置
export default defineConfig({
  // 构建配置
  build: {
    // 禁用 CSS 代码分割，将所有 CSS 合并到一个文件
    cssCodeSplit: false,
    // 库模式配置
    lib: {
      // 指定库的入口文件
      entry: './src/index.ts',
      // 输出文件名格式
      fileName: (_, enterName) => {
        return `${enterName}.js`
      },
      formats: ['es', 'umd'],
      // 库的全局变量名
      name: 'ArtmateMarkdown',
    },
    // Rollup 配置选项
    rollupOptions: {
      external: ['vue'],
      // 输出配置
      output: [
        {
          ...rollupOutputBase,
          // ES 模块输出目录
          dir: 'dist/es',
          // 输出格式为 ES 模块
          format: 'es',
        },
        {
          ...rollupOutputBase,
          dir: 'dist/cjs',
          // 输出格式为 ES 模块
          format: 'cjs',
        },
      ],
    },
  },
  plugins: [
    // Vue 插件，处理 .vue 文件
    vue(),
    dts({
      // TypeScript 声明的根目录
      entryRoot: './src',
      // 让生成的.d.ts文件输出到源文件同级目录中
      outDir: ['dist/typings'],
    }),
  ],
})
