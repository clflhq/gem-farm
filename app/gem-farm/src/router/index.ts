import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Farmer from '@/views/Farmer.vue';
import Manager from '@/views/Manager.vue';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home,
  // },
  // {
  //   path: '/manager',
  //   name: 'Farm Manager',
  //   component: Manager,
  // },
  // {
  //   path: '/farmer',
  //   name: 'Farmer',
  //   component: Farmer,
  // },
  {
    path: '/coinfra-samurai',
    component: Farmer,
    props: {
      collectionName: 'Coinfra Samurai',
      farmAddress: '4dHHXbjg2BcMhxZFNj4YPUHXpVWsZFWNTCiKmojJTyQS',
      candyMachineId: '7V1xuf9HxVVWHGhme6cZX7vF3yWZdaWARNHJrrCsb34g',
    },
  },
  {
    path: '/shinobi-girls',
    component: Farmer,
    props: {
      collectionName: 'Shinobi Girls',
      farmAddress: '4aG3Vn36dQycYfnMX9mZQQHaZgA5P85uevvn5e2JwUfJ',
      candyMachineId: 'GigkY3DjUkKJwdkUtfWitccPW9K8rWQ78oFe7V8u82ca',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
