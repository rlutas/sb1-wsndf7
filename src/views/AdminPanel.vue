<template>
  <div class="admin-panel">
    <h1>Panou de Administrare</h1>
    <div class="client-list">
      <h2>Clienți</h2>
      <ul>
        <li v-for="client in clients" :key="client.id">
          {{ client.name }} - {{ client.status }}
          <button @click="toggleAccess(client)">
            {{ client.status === 'Activ' ? 'Dezactivează' : 'Activează' }}
          </button>
        </li>
      </ul>
    </div>
    <div class="exclusion-list">
      <h2>Listă de Auto-excludere</h2>
      <p>Ultima actualizare: {{ lastUpdate }}</p>
      <button @click="updateExclusionList">Actualizează lista</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMainStore } from '../store'

const store = useMainStore()
const clients = ref([
  { id: 1, name: 'Casino Regal', status: 'Activ' },
  { id: 2, name: 'Lucky Stars', status: 'Inactiv' },
])
const lastUpdate = ref('2023-11-15 10:30')

onMounted(() => {
  // Încărcați datele reale ale clienților și ultima actualizare
})

function toggleAccess(client: any) {
  client.status = client.status === 'Activ' ? 'Inactiv' : 'Activ'
  // Implementați logica de actualizare a statusului clientului pe server
}

async function updateExclusionList() {
  try {
    await store.fetchExclusionList()
    lastUpdate.value = new Date().toLocaleString()
  } catch (error) {
    console.error('Eroare la actualizarea listei de excludere:', error)
  }
}
</script>

<style scoped lang="scss">
.admin-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.client-list, .exclusion-list {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

button {
  background-color: #3c4ccf;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darken(#3c4ccf, 10%);
  }
}
</style>