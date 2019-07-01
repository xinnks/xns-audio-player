import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
	routes: [
		{
			path: '/',
			name: 'home-page',
			component: () => import('./views/Home')
		},
		{
			path: '/about',
			name: 'about-page',
			component: () => import('./views/About')
		}
	]
});
