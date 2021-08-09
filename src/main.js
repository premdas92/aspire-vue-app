import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import moment from 'moment';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Login from "./components/Login.vue";
import AdminDashboard from "./components/AdminDashboard.vue";
import CustomerDashboard from "./components/CustomerDashboard.vue";

Vue.config.productionTip = false;
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
});
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const routes = [
  { path: "/", component: Login },
  { path: "/admin-dashboard", component: AdminDashboard },
  { path: "/customer-dashboard", component: CustomerDashboard },
];

const router = new VueRouter({
  routes: routes,
});

new Vue({
  router: router,
  render: (h) => h(App),
}).$mount("#app");
