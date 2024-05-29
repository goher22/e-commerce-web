<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <h2>Lista de Órdenes</h2>
          <b-table striped hover :items="orders" :fields="fields"></b-table>
          <b-pagination v-model="currentPage" :total-rows="orders.length" :per-page="pageSize" @change="handlePageChange"></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { BTable, BPagination, BContainer, BRow, BCol } from 'bootstrap-vue-3';
import store from '@/store';
import { Order } from '@/models/Order';



export default defineComponent({
  name: 'OrderList',
  components: {
    BTable,
    BPagination,
    BContainer,
    BRow,
    BCol
  },
  setup() {
    const orders = computed(() => store.state.orders);
    const currentPage = ref(1);
    const pageSize = 10;

    const fields = [
      { key: 'id', label: 'ID' },
      { key: 'documentUser', label: 'Documento de Usuario' },
      { key: 'nameUser', label: 'Nombre de Usuario' },
      { key: 'orderDate', label: 'Fecha de la Orden' }
    ];

    onMounted(() => {
      store.dispatch('fetchOrders');
    });

    const startIndex = computed(() => (currentPage.value - 1) * pageSize);

    const sortedOrders = computed(() => {
      const list: Order[] = orders.value
      return list.sort((a: Order, b: Order) => b.orderDate.getTime() - a.orderDate.getTime());
    });

    const paginatedOrders = computed(() => {
      return sortedOrders.value.slice(startIndex.value, startIndex.value + pageSize);
    });

    const handlePageChange = (newPage: number) => {
      store.dispatch('fetchOrders', newPage);
    };

    return {
      orders,
      currentPage,
      pageSize,
      fields,
      paginatedOrders,
      handlePageChange
    };
  }
});
</script>

<style scoped>
.container {
  margin-top: 20px;
}
</style>
