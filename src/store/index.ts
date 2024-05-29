import { createStore } from 'vuex'
import { Product } from '@/models/Product'
import axios from '@/plugins/axios'

const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:8080/api'

export interface State {
  products: Product[];
  selectedProduct: Product | null;
}

export default createStore<State>({
  state: {
    products: [],
    selectedProduct: null
  },
  getters: {
  },
  mutations: {
    setProducts (state, products: Product[]) {
      state.products = products
    },
    addProducts (state, products: Product[]) {
      state.products.push(...products);
    },
    selectProduct (state, product: Product) {
      state.selectedProduct = product
    },
    clearSelectedProduct (state) {
      state.selectedProduct = null
    }
  },
  actions: {

    async fetchProducts ({ commit }, page = 1) {
      try {
        const response = await axios.get(`${apiUrl}/product?page=${page-1}`)
        if(page>1){
          commit('addProducts', response.data.result)
        }else{
          commit('setProducts', response.data.result)
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error)
      }
    },

    async createOrder(_, orderDetails) {
      try {
        const orderResponse = await axios.post('/api/orders', {
          documentUser: orderDetails.documentUser,
          nameUser: orderDetails.nameUser,
          orderDate: orderDetails.orderDate
        });
        const orderId = orderResponse.data.id;

        for (const product of orderDetails.products) {
          await axios.post('/api/order_item', {
            orderId: orderId,
            product: product.product,
            quantity: product.quantity,
            price: product.price
          });
        }
        console.log('Orden creada exitosamente');
      } catch (error) {
        console.error('Error al crear la orden:', error);
        throw error;
      }
    }
  },
  modules: {
  }
})
