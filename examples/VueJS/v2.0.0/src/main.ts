import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAward, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

library.add(faAward, faHandsHelping);

const app = createApp(App);
const pinia = createPinia();
app
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(pinia)
    .mount('#app')
    ;
