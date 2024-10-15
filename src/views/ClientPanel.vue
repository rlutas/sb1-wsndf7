<template>
  <div class="client-panel">
    <h1>Panoul Clientului</h1>
    <div class="client-info">
      <h2>Informații Cont</h2>
      <p><strong>Nume:</strong> {{ clientName }}</p>
      <p><strong>Pachet Actual:</strong> {{ currentPlan }}</p>
      <p><strong>Credite Rămase:</strong> {{ remainingCredits }}</p>
      <p><strong>Data Reînnoirii:</strong> {{ renewalDate }}</p>
    </div>
    <div class="usage-stats">
      <h2>Statistici Utilizare</h2>
      <p><strong>Verificări Efectuate Luna Aceasta:</strong> {{ monthlyChecks }}</p>
      <p><strong>Total Verificări:</strong> {{ totalChecks }}</p>
    </div>
    <div class="upgrade-option" v-if="canUpgrade">
      <h2>Opțiuni de Upgrade</h2>
      <p>Puteți face upgrade la pachetul {{ nextPlan }} pentru mai multe beneficii.</p>
      <button @click="upgradePlan">Upgrade Pachet</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Aceste date ar trebui să vină de la un API în implementarea reală
const clientName = ref('Casino Example')
const currentPlan = ref('Basic')
const remainingCredits = ref(450)
const renewalDate = ref('15 Decembrie 2023')
const monthlyChecks = ref(550)
const totalChecks = ref(2500)
const canUpgrade = ref(true)
const nextPlan = ref('Pro')

function upgradePlan() {
  // Implementați logica de upgrade aici
  console.log('Upgrade solicitat la pachetul', nextPlan.value)
}
</script>

<style scoped lang="scss">
.client-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    color: #3c4ccf;
    margin-bottom: 2rem;
  }

  .client-info, .usage-stats, .upgrade-option {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 0.5rem;
    }
  }

  button {
    background-color: #3c4ccf;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: darken(#3c4ccf, 10%);
    }
  }
}
</style>