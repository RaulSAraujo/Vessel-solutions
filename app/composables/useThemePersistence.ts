import { useAuthApi } from "./api/useAuthApi";

export function useThemePersistence() {
    const theme = useTheme();
    const user = useSupabaseUser();

    // Função para aplicar o tema salvo
    const applySavedTheme = () => {
        let savedTheme: 'dark' | 'light' | null = null;

        if (user.value?.user_metadata?.theme_preference) {
            savedTheme = user.value.user_metadata.theme_preference;
        }

        if (savedTheme) {
            // Força a aplicação do tema correto usando a API atual do Vuetify
            if (savedTheme === 'dark' && !theme.current.value.dark) {
                theme.cycle();
            } else if (savedTheme === 'light' && theme.current.value.dark) {
                theme.cycle();
            }
        }
    };

    // Função para salvar a preferência de tema
    const saveThemePreference = async (themeName: 'dark' | 'light') => {
        // Salva no Supabase se o usuário estiver logado
        if (user.value) {
            const useAuth = useAuthApi();
            await useAuth.updateUserMetadata({
                theme_preference: themeName,
            });
        }
    };

    // Observa mudanças no usuário para aplicar tema quando fizer login
    // Removido onMounted pois o plugin já aplica o tema antes da hidratação
    watch(user, (newUser) => {
        if (newUser) {
            applySavedTheme();
        }
    });

    return {
        applySavedTheme,
        saveThemePreference,
    };
}
