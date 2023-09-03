import { createApp } from 'vue';
import App from './App.vue';
import FormularioVenta from './components/FormularioVenta.vue'
import { createRouter, createWebHistory } from 'vue-router';
import LocalidadesTabla from './components/LocalidadesTabla.vue';
import Partido from './components/Partido.vue';
import ResumenVenta from './components/ResumenVenta.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import PartidosResume from './components/PartidosResumen.vue';
import CompraCompleta from './components/CompraCompleta.vue';
import CambioClave from './components/CambioClave.vue';
import GestionProcesos from './components/GestionProcesos.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/registro', component: RegisterPage },
  { path: '/partidos', component: Partido },
  { path: '/localidades/:codigoPartido', component: LocalidadesTabla },
  { path: '/resumen-partidos/:codigoPartido', component: ResumenVenta },
  { path: '/formVenta', component: FormularioVenta },
  { path: '/lista-resumen', component: PartidosResume },
  { path: '/compra-completa', component: CompraCompleta },
  { path: '/gestion-procesos', component: GestionProcesos },
  { path: '/cambio-clave', component: CambioClave }

];


const router = createRouter({
  history: createWebHistory(),
  routes
});

createApp(App)
  .use(router)
  .mount('#app');
