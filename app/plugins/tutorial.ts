export default defineNuxtPlugin(() => {
  if (process.server) return;

  const router = useRouter();
  const tutorialRouter = useTutorialRouter();

  // Lista de rotas que possuem tutorial
  const routesWithTutorial = [
    '/dashboard',
    '/clients',
    '/drinks',
    '/events',
    '/quotations',
    '/suppliers',
    '/ingredients',
    '/event-quotations',
    '/purchase-list',
    '/profitability',
    '/quotation-history',
    '/ingredient-consumption',
    '/profile',
  ];

  // Iniciar tutorial quando a rota mudar
  router.afterEach((to) => {
    // Verificar se a rota atual possui tutorial
    if (routesWithTutorial.includes(to.path)) {
      // Aguardar um pouco para garantir que a página foi renderizada
      setTimeout(() => {
        tutorialRouter.startTutorialForRoute(to.path);
      }, 500);
    }
  });

  // Iniciar tutorial na rota inicial se necessário
  onMounted(() => {
    const currentPath = router.currentRoute.value.path;
    if (routesWithTutorial.includes(currentPath)) {
      setTimeout(() => {
        tutorialRouter.startTutorialForRoute(currentPath);
      }, 500);
    }
  });
});

