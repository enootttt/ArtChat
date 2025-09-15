import type { Root } from 'hast'
import type {
  BundledHighlighterOptions,
  CodeToHastOptions,
  CodeToTokensBaseOptions,
  CodeToTokensOptions,
  CodeToTokensWithThemesOptions,
  GrammarState,
  HighlighterGeneric,
  RequireKeys,
  ThemedToken,
  ThemedTokenWithVariants,
  TokensResult,
} from 'shiki'
import { createdBundledHighlighter, createOnigurumaEngine, createSingletonShorthands } from 'shiki'
import { onUnmounted, provide, ref } from 'vue'
import { GLOBAL_SHIKI_KEY } from '../shared'
import { languageLoaders, themeLoaders } from './shiki-loader'

export interface GlobalShiki {
  codeToHtml: (code: string, options: CodeToHastOptions<string, string>) => Promise<string>
  codeToHast: (code: string, options: CodeToHastOptions<string, string>) => Promise<Root>
  codeToTokensBase: (
    code: string,
    options: RequireKeys<CodeToTokensBaseOptions<string, string>, 'theme' | 'lang'>
  ) => Promise<ThemedToken[][]>
  codeToTokens: (
    code: string,
    options: CodeToTokensOptions<string, string>
  ) => Promise<TokensResult>
  codeToTokensWithThemes: (
    code: string,
    options: RequireKeys<CodeToTokensWithThemesOptions<string, string>, 'lang' | 'themes'>
  ) => Promise<ThemedTokenWithVariants[][]>
  getSingletonHighlighter: (
    options?: Partial<BundledHighlighterOptions<string, string>>
  ) => Promise<HighlighterGeneric<string, string>>
  getLastGrammarState:
    | ((element: ThemedToken[][] | Root) => GrammarState)
    | ((code: string, options: CodeToTokensBaseOptions<string, string>) => Promise<GrammarState>)
}

/**
 * @description Shiki 管理器（单例 + 懒初始化）
 */
class ShikiManager {
  private static instance: ShikiManager | null = null

  private shikiInstance: GlobalShiki | null = null

  private constructor() {}

  static getInstance(): ShikiManager {
    if (!ShikiManager.instance) {
      ShikiManager.instance = new ShikiManager()
    }
    return ShikiManager.instance
  }

  public getShiki(): GlobalShiki {
    if (this.shikiInstance) return this.shikiInstance

    const highlighterFactory = createdBundledHighlighter({
      langs: languageLoaders,
      themes: themeLoaders,
      engine: () => createOnigurumaEngine(import('shiki/wasm')),
    })

    const {
      codeToHtml,
      codeToHast,
      codeToTokensBase,
      codeToTokens,
      codeToTokensWithThemes,
      getSingletonHighlighter,
      getLastGrammarState,
    } = createSingletonShorthands(highlighterFactory)

    this.shikiInstance = {
      codeToHtml,
      codeToHast,
      codeToTokensBase,
      codeToTokens,
      codeToTokensWithThemes,
      getSingletonHighlighter,
      getLastGrammarState,
    }
    return this.shikiInstance
  }

  public dispose() {
    this.shikiInstance = null
    ShikiManager.instance = null
  }
}

// 全局状态管理
let globalShikiInstance: GlobalShiki | undefined
let globalShikiManager: ShikiManager | undefined
let referenceCount = 0

const shikiIsCreated = ref(false)
const shikiInstance = ref<GlobalShiki>()
const shikiManager = ref<ShikiManager>()

/**
 * @description 在 Vue 中提供 Shiki 实例（支持多组件实例）
 */
export function useShiki(): GlobalShiki {
  // 增加引用计数
  referenceCount++

  // ✅ 注册 onUnmounted 钩子
  onUnmounted(() => {
    referenceCount--
    console.log(`shiki reference count: ${referenceCount}`)

    // 只有当所有组件都卸载时才清理
    if (referenceCount === 0) {
      console.log('shiki destroyed - all references removed')
      shikiIsCreated.value = false
      shikiInstance.value = undefined
      shikiManager.value?.dispose()
      globalShikiManager?.dispose()
      globalShikiInstance = undefined
      globalShikiManager = undefined
    }
  })

  // ✅ 仅在首次时初始化
  if (!globalShikiInstance) {
    console.log('shiki created')
    globalShikiManager = ShikiManager.getInstance()
    globalShikiInstance = globalShikiManager.getShiki()

    shikiManager.value = globalShikiManager
    shikiInstance.value = globalShikiInstance

    provide(GLOBAL_SHIKI_KEY, shikiInstance)
    shikiIsCreated.value = true
  } else {
    // 为后续组件实例提供相同的实例
    shikiManager.value = globalShikiManager
    shikiInstance.value = globalShikiInstance
    provide(GLOBAL_SHIKI_KEY, shikiInstance)
  }

  return globalShikiInstance
}
