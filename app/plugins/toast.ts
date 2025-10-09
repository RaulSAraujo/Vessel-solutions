import Vue3Toastify, { toast } from "vue3-toastify";
import type { ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    // Configura o Vue3Toastify com base no tema
    nuxtApp.vueApp.use(Vue3Toastify, {
        autoClose: 5000,
        theme: 'colored',
        position: "bottom-right",
        clearOnUrlChange: false,
        newestOnTop: true,
    } as ToastContainerOptions);

    return {
        provide: {
            toast,
        },
    };
});