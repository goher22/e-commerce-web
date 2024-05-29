<template>
  <div>
    <b-container>
      <h1>Crear Orden</h1>
      <b-row>
        <b-col>
          <b-card>
            <b-card-title>Productos</b-card-title>
            <b-list-group ref="productContainer" @scroll="loadMoreProducts">
              <b-list-group-item
                v-for="product in products"
                :key="product.id"
                @click="toggleProductSelection(product)"
                :active="isSelected(product)"
                action
              >
                {{ product.name }} - ${{ product.price }} - Stock: {{ product.stock }}
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <b-col>
          <b-card>
            <b-card-title>Orden</b-card-title>
            <div v-if="selectedProducts.length > 0">
              <p>Productos seleccionados:</p>
              <ul>
                <li v-for="product in selectedProducts" :key="product.id">
                  {{ product.name }}
                  <b-button @click="decrementQuantity(product)" variant="danger">-</b-button>
                  Cantidad: {{ product.quantity }}
                  <b-button @click="incrementQuantity(product)" variant="success">+</b-button>
                  - Total: ${{ (product.quantity  * product.price).toFixed(2) }}
                </li>
              </ul>
              <p>Total de la orden: ${{ totalOrder.toFixed(2) }}</p>
              <b-form-group label="Nombre:" label-for="name">
                <b-form-input id="name" v-model="name" required></b-form-input>
              </b-form-group>
              <b-form-group label="Documento:" label-for="document">
                <b-form-input id="document" v-model="document" required></b-form-input>
              </b-form-group>
              <b-button @click="createOrder" variant="primary">Crear Orden</b-button>
            </div>
            <div v-else>
              <p>Selecciona al menos un producto para crear una orden.</p>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import store from '@/store';
import { Product } from '@/models/Product';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const products = computed(() => store.state.products);
    const selectedProducts = ref([] as Product[]);
    const displayedProducts = ref([] as Product[]);
    const name = ref('');
    const document = ref('');
    const productContainer = ref(null);
    const totalOrder = computed(() => calculateTotalOrder(selectedProducts.value));

    const PAGE_SIZE = 10;
    let currentPage = 1;

    const isSelected = (product: Product) => {
      return selectedProducts.value.some(selectedProduct => selectedProduct.id === product.id);
    };

    const toggleProductSelection = (product: Product) => {
      if (isSelected(product)) {
        selectedProducts.value = selectedProducts.value.filter(selectedProduct => selectedProduct.id !== product.id);
      } else {
        selectedProducts.value.push({ ...product, quantity: 1 });
      }
    };

    const incrementQuantity = (product: Product) => {
      const index = selectedProducts.value.findIndex(selectedProduct => selectedProduct.id === product.id);
      if (index !== -1) {
        selectedProducts.value[index].quantity++;
      }
    };

    const decrementQuantity = (product: Product) => {
      const index = selectedProducts.value.findIndex(selectedProduct => selectedProduct.id === product.id);
      if (index !== -1 && selectedProducts.value[index].quantity > 1) {
        selectedProducts.value[index].quantity--;
      }
    };

    const calculateTotalOrder = (selectedProducts: Product[]) => {
      return selectedProducts.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    };

    const createOrder = async () => {
      try {
          const orderDetails = {
            documentUser: document.value,
            nameUser: name.value,
            orderDate: new Date().toISOString(),
            products: selectedProducts.value.map(product => ({
              product: product.name,
              quantity: product.quantity,
              price: product.price
            }))
          };
          store.dispatch('createOrder', orderDetails);
        alert('Orden creada exitosamente');
        selectedProducts.value = [];
      } catch (error) {
        console.error('Error al crear la orden:', error);
        alert('Error al crear la orden');
      }
    };

    const loadMoreProducts = async () => {
      const conte: HTMLElement | null = productContainer.value;
      if(conte!=null){
        const container = conte as HTMLElement;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          try {
            currentPage++;
            await store.dispatch('fetchProducts', currentPage)
          } catch (error) {
            console.error('Error al cargar más productos:', error);
          }
        }
      }

    };

    const onScroll = () => {
      loadMoreProducts();
    };

    onMounted(() => {
      store.dispatch('fetchProducts');
      displayedProducts.value = products.value.slice(0, PAGE_SIZE);
    });

    return {
      name,
      document,
      products,
      productContainer,
      selectedProducts,
      displayedProducts,
      totalOrder,
      loadMoreProducts,
      isSelected,
      toggleProductSelection,
      onScroll,
      incrementQuantity,
      decrementQuantity,
      createOrder
    };
  }
});
</script>

<style scoped>
.home {
  margin-top: 20px;
}
</style>
