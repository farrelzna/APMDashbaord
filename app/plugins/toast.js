import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    // options placeholder
    timeout: 4000,
    closeOnClick: true,
    draggable: true,
    hideProgressBar: false
  });
});