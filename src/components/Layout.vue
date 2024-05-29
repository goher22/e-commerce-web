<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col cols="2" class="bg-light vh-100 d-flex flex-column justify-content-between">
          <div>
            <b-card class="text-center mt-3 mb-3">
              <b-card-title>E-commerce</b-card-title>
            </b-card>
            <b-nav vertical>
              <router-link
                to="/"
                class="nav-link"
                :class="{ active: $route.path === '/' }"
              >
                <i class="bi bi-house"></i> Home
              </router-link>
              <!-- Puedes agregar más elementos de menú aquí -->
              <router-link
                to="/another"
                class="nav-link"
                :class="{ active: $route.path === '/another' }"
              >
                <i class="bi bi-file-earmark"></i> Another Page
              </router-link>
            </b-nav>
          </div>
          <div>
            <b-nav vertical>
              <b-nav-item @click="logout" style="cursor: pointer;">
                <i class="bi bi-box-arrow-right"></i> Logout
              </b-nav-item>
            </b-nav>
          </div>
        </b-col>
        <b-col>
          <b-container>
            <router-view></router-view>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LayoutView',
  setup () {
    const router = useRouter()

    const logout = () => {
      localStorage.removeItem('authToken')
      router.push({ name: 'Login' })
    }

    return {
      logout
    }
  }
})
</script>

<style scoped>
.vh-100 {
  height: 100vh;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.active {
  font-weight: bold;
  color: #0d6efd !important;
  background-color: rgba(0, 0, 0, 0.1);
}
.nav-link {
  display: flex;
  align-items: center;
  color: white;
}
.nav-link i {
  margin-right: 8px;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
