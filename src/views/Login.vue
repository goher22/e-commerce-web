<template>
  <div class="login">
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col md="4">
          <b-card title="Login">
            <h1 class="text-center mb-4">e-commerce</h1>
            <b-alert
              v-if="errorMessage"
              variant="danger"
              show
              dismissible
            >
              {{ errorMessage }}
            </b-alert>
            <b-form @submit.prevent="onSubmit">
              <b-form-group label="Username:" label-for="username">
                <b-form-input
                  id="username"
                  v-model="username"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password:" label-for="password">
                <b-form-input
                  id="password"
                  type="password"
                  v-model="password"
                  required
                ></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary" :disabled="isLoading">{{ isLoading ? 'Loading...' : 'Login' }}</b-button>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'

export default defineComponent({
  name: 'Login',
  setup () {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isLoading = ref(false)
    const apiUrl = process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:8080/api'

    const onSubmit = async () => {
      try {
        isLoading.value = true
        const response = await axios.post(`${apiUrl}/auth/login`, {
          username: username.value,
          password: password.value
        })
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token)
          router.push({ name: 'Home' })
        } else {
          errorMessage.value = 'No se recibió un token de autenticación'
        }
      } catch (error) {
        console.error(error)
        // errorMessage.value = error.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      username,
      password,
      errorMessage,
      isLoading,
      onSubmit
    }
  }
})
</script>

<style scoped>
.login {
  margin-top: 100px;
}
</style>
