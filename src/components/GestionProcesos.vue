<template>
    <div class="container">
      <!-- Menú lateral -->
      <div class="menu-bar">
        <!--<div>{{ usuarioLogueado.nombre }}</div>-->
        <img class="menu-image" src="https://www.clker.com/cliparts/u/i/3/7/G/W/tuerca-md.png" alt="Imagen de menú">
        <p></p>
        
    <div v-if="usuarioLogueado">Gestion de Procesos parar <b>{{ usuarioLogueado.nombre }}</b></div>
    <p></p>
        <router-link class="menu-button" to="/cambio-clave">Cambio de clave</router-link>
        <a class="exit-button" href="/partidos">Salir</a>
        
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
    background-image: url('https://cdn.wallpapersafari.com/59/61/wScxR0.jpg');
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
    background-color: #744caf;
    color: #ffffff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .menu-button:hover {
    background-color: #744caf;
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
    background-color: #4CAF50;
    color: #ffffff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .card-button:hover {
    background-color: #45a049;
  }
  
  
    </style>
    