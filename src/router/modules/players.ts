import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const playerRoutes: RouteConfig = {
  path: '/players',
  component: Layout,
  meta: {
    title: 'playerMgt', // i18n信息需要额外处理
    icon: 'peoples'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/players/list.vue'),
      meta: {
        title: 'playerList',
        icon: 'players'
      }
    }
  ]
}

export default playerRoutes
