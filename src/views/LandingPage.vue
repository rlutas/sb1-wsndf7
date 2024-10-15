<template>
  <div class="landing-page">
    <header>
      <h1>Verificare ID Casino - Soluție SaaS</h1>
      <p class="tagline">Verificare rapidă și sigură a identității pentru industria jocurilor de noroc</p>
    </header>

    <section class="about-us">
      <h2>Despre Noi</h2>
      <p>Suntem o companie de tehnologie specializată în soluții de verificare a identității pentru industria cazinourilor și a jocurilor de noroc. Cu o experiență de peste 10 ani în domeniu, oferim servicii de înaltă calitate care ajută operatorii să respecte reglementările și să mențină un mediu de joc sigur.</p>
    </section>

    <section class="features">
      <h2>De Ce Să Ne Alegeți</h2>
      <ul>
        <li>Verificare rapidă în timp real</li>
        <li>Integrare ușoară cu sistemele existente</li>
        <li>Conformitate cu reglementările ONJN</li>
        <li>Suport tehnic 24/7</li>
        <li>Securitate de top a datelor</li>
        <li>Actualizări automate ale listei de auto-excludere</li>
      </ul>
    </section>

    <section class="pricing">
      <h2>Pachete de Prețuri</h2>
      <div class="price-cards">
        <div class="price-card" v-for="plan in plans" :key="plan.name">
          <h3>{{ plan.name }}</h3>
          <p class="price">{{ plan.price }} lei/lună</p>
          <ul>
            <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
          </ul>
          <button @click="selectPlan(plan)">Alege planul</button>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <h2>Ce Spun Clienții Noștri</h2>
      <div class="testimonial">
        <p>"Această soluție ne-a ajutat să eficientizăm procesul de verificare a identității și să îmbunătățim experiența clienților noștri."</p>
        <cite>- Maria Popescu, Manager Casino Royal</cite>
      </div>
      <div class="testimonial">
        <p>"Serviciul de suport este excelent, iar integrarea a fost foarte ușoară. Recomand cu încredere!"</p>
        <cite>- Ion Ionescu, Director Tehnic, Lucky Stars Casino</cite>
      </div>
    </section>

    <section class="contact">
      <h2>Contactați-ne</h2>
      <p>Sunteți gata să îmbunătățiți procesul de verificare a identității în cazinoul dumneavoastră? Contactați-ne astăzi pentru o demonstrație gratuită!</p>
      <button @click="showContactForm">Solicitați o Demo</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const plans = ref([
  {
    name: 'Basic',
    price: 500,
    features: ['Până la 1000 de verificări/lună', 'Suport prin email', 'Actualizări săptămânale ale listei de auto-excludere']
  },
  {
    name: 'Pro',
    price: 1000,
    features: ['Verificări nelimitate', 'Suport prioritar 24/7', 'Actualizări zilnice ale listei de auto-excludere', 'Rapoarte avansate']
  },
  {
    name: 'Enterprise',
    price: 'Personalizat',
    features: ['Soluție personalizată', 'Integrare API completă', 'Manager de cont dedicat', 'Asistență pentru conformitate']
  }
])

function selectPlan(plan: any) {
  console.log(`Plan selectat: ${plan.name}`)
  // Implementați logica de selecție a planului aici
}

function showContactForm() {
  console.log('Afișare formular de contact')
  // Implementați logica pentru afișarea formularului de contact sau redirecționare către pagina de contact
}
</script>

<style scoped lang="scss">
.landing-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Open Sans', sans-serif;

  header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      color: #3c4ccf;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .tagline {
      font-size: 1.2rem;
      color: #6c757d;
    }
  }

  section {
    margin-bottom: 4rem;

    h2 {
      color: #2c3e50;
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
  }

  .about-us, .features, .testimonials, .contact {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .features {
    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;

        &:before {
          content: '✓';
          color: #3c4ccf;
          position: absolute;
          left: 0;
        }
      }
    }
  }

  .price-cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .price-card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    margin: 1rem;
    width: 300px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    h3 {
      color: #3c4ccf;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem 0;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin-bottom: 1.5rem;
    }

    button {
      background-color: #3c4ccf;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken(#3c4ccf, 10%);
      }
    }
  }

  .testimonials {
    .testimonial {
      margin-bottom: 1.5rem;
      font-style: italic;

      cite {
        display: block;
        text-align: right;
        margin-top: 0.5rem;
        font-style: normal;
        font-weight: bold;
      }
    }
  }

  .contact {
    text-align: center;

    button {
      background-color: #3c4ccf;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: darken(#3c4ccf, 10%);
      }
    }
  }
}
</style>