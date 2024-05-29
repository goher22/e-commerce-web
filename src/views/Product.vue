<template>
  <div>
    <b-container fluid>
      <b-row>
        <!-- Tabla de productos -->
        <b-col cols="8">
          <h2>Lista de Productos</h2>
          <b-table striped hover :items="paginatedProducts" :fields="fields">
            <template #cell(actions)="data">
              <b-button size="sm" variant="outline-danger" @click="deleteProduct(data.item.id)">Eliminar</b-button>
              <b-button size="sm" variant="outline-warning" @click="editProduct(data.item)">Editar</b-button>
            </template>
          </b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalProducts"
            :per-page="pageSize"
            aria-controls="product-table"
            @change="handlePageChange"
          ></b-pagination>
        </b-col>

        <b-col cols="4">
          <h2>{{ isNewProduct ? 'Crear Producto' : 'Editar Producto' }}</h2>
          <b-form @submit.prevent="isNewProduct ? createProduct() : updateProduct()">
            <b-form-group label="Nombre:" label-for="name">
              <b-form-input id="name" v-model="formData.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Descripción:" label-for="description">
              <b-form-textarea id="description" v-model="formData.description" required></b-form-textarea>
            </b-form-group>
            <b-form-group label="Precio:" label-for="price">
              <b-form-input type="number" id="price" v-model="formData.price" required></b-form-input>
            </b-form-group>
            <b-form-group label="Stock:" label-for="stock">
              <b-form-input type="number" id="stock" v-model="formData.stock" required></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">
              {{ isNewProduct ? 'Crear' : 'Actualizar' }}
            </b-button>
            <b-button type="button" variant="secondary" @click="clearForm">Cancelar</b-button>
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { BTable, BPagination, BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-3';
import store from '@/store';
import { Product } from '@/models/Product';

export default defineComponent({
  name: 'ProductManagement',
  components: {
    BTable,
    BPagination,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BButton,
  },
  setup() {
    const products = computed(() => store.state.products);
    const formData = ref<{ id: number | null; name: string; description: string; price: number; stock: number }>({ id: null, name: '', description: '', price: 0, stock: 0 });
    const isNewProduct = ref(true);
    const currentPage = ref(1);
    const pageSize = 10;

    const fields = [
      { key: 'name', label: 'Nombre' },
      { key: 'description', label: 'Descripción' },
      { key: 'price', label: 'Precio' },
      { key: 'stock', label: 'Stock' },
      { key: 'actions', label: 'Acciones' },
    ];

    const totalProducts = computed(() => products.value.length);
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return products.value.slice(start, start + pageSize);
    });

    const handlePageChange = (newPage: number) => {
      store.dispatch('fetchProducts', newPage);
    };

    const createProduct = async () => {
      try {
        await store.dispatch('createProduct', formData.value);
        clearForm();
      } catch (error) {
        console.error('Error al crear el producto:', error);
      }
    };

    const updateProduct = async () => {
      try {
        await store.dispatch('updateProduct', formData.value);
        clearForm();
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    };

    const deleteProduct = async (productId: number) => {
      try {
        await store.dispatch('deleteProduct', productId);
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    };

    const editProduct = (product: Product) => {
      formData.value = { id: product.id, name: product.name, description: product.description, price: product.price, stock: product.stock };
      isNewProduct.value = false;
    };

    const clearForm = () => {
      formData.value = { id: null, name: '', description: '', price: 0, stock: 0 };
      isNewProduct.value = true;
    };

    onMounted(() => {
      store.dispatch('fetchProducts');
    });

    return {
      products,
      formData,
      isNewProduct,
      fields,
      currentPage,
      pageSize,
      totalProducts,
      paginatedProducts,
      handlePageChange,
      createProduct,
      updateProduct,
      deleteProduct,
      editProduct,
      clearForm,
    };
  },
});
</script>

<style scoped>
.container {
  margin-top: 20px;
}
</style>
