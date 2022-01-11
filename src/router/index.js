import Vue from 'vue'
import VueRouter from 'vue-router'

const ChainPath = () => import('@/views/ChainPath.vue')
const ChainPathColumn = () => import('@/views/ChainPathColumn.vue')
const ChainPathColumnPlus = () => import('@/views/ChainPathColumnPlus.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/chainPath',
    name: ChainPath.name,
    component: ChainPath
  }, {
    path: '/chainPathColumn',
    name: ChainPathColumn.name,
    component: ChainPathColumn
  }, {
    path: '/chainPathColumnPlus',
    name: ChainPathColumnPlus.name,
    component: ChainPathColumnPlus
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
