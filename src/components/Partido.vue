<template>
  <div class="container">
    <!-- Menú lateral -->
    <div class="menu-bar">
      <!--<div>{{ usuarioLogueado.nombre }}</div>-->
      <img class="menu-image" src="https://cdn-icons-png.flaticon.com/512/188/188899.png" alt="Imagen de menú">
      <p></p>
      
  <div v-if="usuarioLogueado">Bienvenid@ de Nuevo <b>{{ usuarioLogueado.nombre }}</b></div>
  <p></p>
      <router-link class="menu-button" to="/partidos">Partidos</router-link>
      <router-link class="menu-button" to="/lista-resumen">Resumen Ventas</router-link>
      <router-link class="menu-button" to="/gestion-procesos">Gestion Procesos</router-link>
      <a class="exit-button" href="/">Salir</a>
      
    </div>

    <!-- Contenido principal -->
    <div class="content">
      <h1 style="color: aliceblue;">Lista de Partidos</h1>

      <div class="card-container" style="align-items: center;">
        <div class="card" style="align-items: center;" v-for="partido in partidos" :key="partido.CODIGO">
          <h2 class="card-title">{{ partido.EQUIPO_LOCAL }} vs {{ partido.EQUIPO_VISITA }}</h2>
          <p class="card-description">{{ partido.LUGAR }} </p>
          <p class="card-description">{{ partido.FECHA }} </p>
          <button class="card-button" @click="comprarEntradas(partido.CODIGO)">Seleccionar</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>

  export default {
    name: 'PartidoHoy',
    data() {
      return {
        partidos: [],
        usuarioLogueado: null
      };
    },
    mounted() {
      fetch('http://localhost:3000/partidos')
        .then(response => response.json())
        .then(data => {
          this.partidos = data;
        })
        .catch(error => {
          console.error('Error al obtener los partidos:', error);
        });
        fetch('http://localhost:3000/usuario-logueado')
    .then(response => response.json())
    .then(data1 => {
        this.usuarioLogueado = data1;
    })
    .catch(error => {
      console.error('Error al obtener el usuario logueado:', error);
    });
    },
    filters: {
      formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
      }
    },
    methods: {
  
      comprarEntradas(codigoPartido) {
        // Redireccionar a la siguiente página con el código de partido en la URL
        this.$router.push(`/localidades/${codigoPartido}`);
      }
    }
    
  };
  
  </script>
  
  <style>
  /* Estilos generales */
body {
  font-family: Arial, sans-serif;
  align-content: center;
  background-image: url('https://images.ctfassets.net/hrltx12pl8hq/5KiKmVEsCQPMNrbOE6w0Ot/341c573752bf35cb969e21fcd279d3f9/hero-img_copy.jpg?fit=fill&w=600&h=400');
  background-size: cover;
}

.container {
  display: grid;
}

.menu-bar {
  width: 97%;
  background-color: #f2f2f2;
  padding: 20px;
}

.menu-button {
  display: block;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: blue;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}

.menu-button:hover {
  background-color: blue;
}

.menu-image {
  display: block;
  width: 10%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
  margin-left: 45%;
}

.exit-button {
  display: block;
  margin-top: auto;
  padding: 10px 20px;
  background-color: #f44336;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}

.exit-button:hover {
  background-color: #d32f2f;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  margin-bottom: 20px;
}

.card-button {
  display: block;
  padding: 10px 20px;
  background-color: blue;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}

.card-button:hover {
  background-color: blue;
}


  </style>
  