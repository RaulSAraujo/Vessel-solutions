import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // Estado reativo do tema
  const currentTheme = ref<'dark' | 'light' | null>(null)
  const isInitialized = ref(false)

  // Flags para controle de aplicação
  const hasAppliedInitialTheme = ref(false)
  const isSavingTheme = ref(false)

  // Chave para o localStorage
  const THEME_STORAGE_KEY = 'vessel-theme-preference'

  // Função para obter tema do localStorage
  const getStoredTheme = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(THEME_STORAGE_KEY)
    }
    return null
  }

  // Função para salvar tema no localStorage
  const setStoredTheme = (themeName: string) => {
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, themeName)
    }
  }

  // Função para limpar tema do localStorage
  const clearStoredTheme = () => {
    if (import.meta.client) {
      localStorage.removeItem(THEME_STORAGE_KEY)
    }
  }

  // Aplica o tema no Vuetify (recebe o theme como parâmetro)
  const applyTheme = (themeName: 'dark' | 'light', theme: ReturnType<typeof useTheme>) => {
    if (themeName === 'dark' && !theme.current.value.dark) {
      theme.change('dark')
    } else if (themeName === 'light' && theme.current.value.dark) {
      theme.change('light')
    }
  }

  // Aplica o tema salvo (recebe o theme como parâmetro)
  const applySavedTheme = (theme: ReturnType<typeof useTheme>) => {
    // Não aplica se estamos salvando o tema ou se já aplicamos o tema inicial
    if (isSavingTheme.value || hasAppliedInitialTheme.value) {
      return
    }

    if (currentTheme.value) {
      applyTheme(currentTheme.value, theme)
    }

    // Marca que já aplicamos o tema inicial
    hasAppliedInitialTheme.value = true
  }

  // Inicializa o tema (chamado no cliente após hidratação)
  const initializeTheme = (userTheme?: string | null) => {
    if (isInitialized.value) return

    // Prioriza localStorage, depois user_metadata
    const storedTheme = getStoredTheme()
    const themeToUse = storedTheme || userTheme || null

    if (themeToUse) {
      currentTheme.value = themeToUse as 'dark' | 'light'
    }

    isInitialized.value = true
  }

  // Salva tema (localStorage + Supabase)
  const saveTheme = async (themeName: 'dark' | 'light', user?: ReturnType<typeof useSupabaseUser>) => {
    isSavingTheme.value = true
    currentTheme.value = themeName
    setStoredTheme(themeName)

    // Salva no Supabase se o usuário estiver logado
    if (user?.value) {
      const { useAuthApi } = await import('~/composables/api/useAuthApi')
      const useAuth = useAuthApi()
      await useAuth.updateUserMetadata({
        theme_preference: themeName,
      })
    }

    // Reset da flag após um pequeno delay para evitar re-aplicação
    setTimeout(() => {
      isSavingTheme.value = false
    }, 100)
  }

  // Limpa tema (logout)
  const clearTheme = () => {
    currentTheme.value = null
    clearStoredTheme()
    isInitialized.value = false
    hasAppliedInitialTheme.value = false
  }

  // Sincroniza com user_metadata
  const syncWithUser = (userTheme: string | null) => {
    if (!isInitialized.value) return

    const storedTheme = getStoredTheme()

    if (storedTheme) {
      // Se tem no localStorage, sincroniza com Supabase se for diferente
      if (userTheme !== storedTheme) {
        saveTheme(storedTheme as 'dark' | 'light')
      }
    } else if (userTheme) {
      // Se não tem no localStorage mas tem no Supabase, salva no localStorage
      currentTheme.value = userTheme as 'dark' | 'light'
      setStoredTheme(userTheme)
    }
  }

  // Observa mudanças no usuário para aplicar tema quando fizer login
  const setupUserWatcher = (user: ReturnType<typeof useSupabaseUser>, theme: ReturnType<typeof useTheme>) => {
    watch(user, (newUser, oldUser) => {
      // Login: usuário mudou de null/undefined para um usuário válido
      if (newUser && !oldUser) {
        hasAppliedInitialTheme.value = false

        // Inicializa o tema no store
        initializeTheme(newUser.user_metadata?.theme_preference)

        // Sincroniza com user_metadata
        syncWithUser(newUser.user_metadata?.theme_preference || null)

        applySavedTheme(theme)
      }

      // Logout: usuário mudou de válido para null/undefined
      if (!newUser && oldUser) {
        // Limpa o tema quando faz logout
        clearTheme()
      }
    })
  }

  // Observa mudanças no tema para aplicar automaticamente
  const setupThemeWatcher = (theme: ReturnType<typeof useTheme>) => {
    watch(currentTheme, (newTheme) => {
      if (newTheme && !isSavingTheme.value && hasAppliedInitialTheme.value) {
        // Aplica o tema quando a preferência muda
        applyTheme(newTheme, theme)
      }
    })
  }

  // Inicializa watchers
  const initializeWatchers = (theme: ReturnType<typeof useTheme>, user: ReturnType<typeof useSupabaseUser>) => {
    setupUserWatcher(user, theme)
    setupThemeWatcher(theme)
  }

  return {
    // Estado
    currentTheme: currentTheme,
    isInitialized: isInitialized,

    // Ações
    initializeTheme,
    saveTheme,
    clearTheme,
    syncWithUser,
    applySavedTheme,
    initializeWatchers,
  }
})
