<template>
    <!---->
  
    <div class="container">
      <!-- Menú lateral -->
      <div class="menu-bar">
        <!--<div>{{ usuarioLogueado.nombre }}</div>-->
        <img class="menu-image" src="https://cdn-icons-png.flaticon.com/512/188/188899.png" alt="Imagen de menú">
        <p></p>
        
    <div v-if="usuarioLogueado"><b>Selección de Localiades</b></div>
    <p></p>
        <router-link class="menu-button" to="/">Partidos</router-link>
        <router-link class="menu-button" to="/lista-resumen">Resumen Ventas</router-link>
        <a class="exit-button" href="/">Salir</a>
        
      </div>
  
      <!-- Contenido principal -->
      <div class="content">
        <h1 style="color: aliceblue;">Localidades del partido {{ this.$route.params.codigoPartido }}</h1>
        
        <div v-if="errorMessage" class="error-message"><b>{{ errorMessage }}</b></div> <p></p>
        <div class="card-container" style="align-items: center;">
          <div class="card" style="align-items: center;" v-for="localidad in localidades" :key="localidad.CODIGO_LOCALIDAD">
            <h2 class="card-title">{{ localidad.NOMBRE }}</h2>
            <p class="card-description">Precio: <b>{{ localidad.PRECIO }} $</b> </p>
            <p class="card-description">Disponibles: <b>{{ localidad.DISPONIBILIDAD }}</b></p>
            <div class="quantity-selector">
        <button class="quantity-button" @click="decrementQuantity(localidad)">-</button>
        <input class="quantity-input" type="number" v-model.number="localidad.cantidad" min="0" :max="localidad.DISPONIBILIDAD" />
        <button class="quantity-button" @click="incrementQuantity(localidad)">+</button><p></p>
      </div>
      <button class="card-button" @click="agregarLocalidad(localidad)">Seleccionar</button>
          </div>
        </div><p></p>
        <button class="final-button" @click="realizarCompra">Continuar Compra</button>
  
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LocalidadesTabla',
    data() {
      return {
        localidades: [],
        localidadesSeleccionadas: [],
        errorMessage: '',
        usuarioLogueado: null
      };
    },
    mounted() {
      const codigoPartido = this.$route.params.codigoPartido;
      const url = `http://localhost:3000/localidades/${codigoPartido}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.localidades = data;
        })
        .catch(error => {
          console.error('Error al obtener las localidades:', error);
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
    methods:{
      
      agregarLocalidad(localidad) {
        const localidadSeleccionada = this.localidadesSeleccionadas.find(item => item.codigoLocalidad === localidad.CODIGO_LOCALIDAD);
        if (localidad.cantidad === undefined) {
          localidad.cantidad = 0;
        }
        if(localidad.cantidad != 0){
          if (localidadSeleccionada) {
          localidadSeleccionada.cantidad += localidad.cantidad;
          } else {
            this.localidadesSeleccionadas.push({
              codigoPartido: localidad.PARTIDO_CODIGO,
              codigoLocalidad: localidad.CODIGO_LOCALIDAD,
              nombreLocalidad: localidad.NOMBRE,
              precioLocalidad: localidad.PRECIO,
              cantidad: localidad.cantidad,
              precioTotal : localidad.cantidad*localidad.PRECIO
            });
            this.errorMessage = 'Se agregó '+localidad.cantidad+' entrada(s) de '+localidad.NOMBRE+' al carrito!';
          }
        }else{
          this.errorMessage = 'El valor de entradas a Agregar no puede ser Igual a 0';
        }
        
  
        // Restablecer la cantidad seleccionada a 0 para la localidad actual
        localidad.cantidad = 0;
      },
      realizarCompra() {
        // Validar si hay al menos una localidad seleccionada antes de continuar
        
        if (this.localidadesSeleccionadas.length === 0) {
          // Mostrar un mensaje de error o tomar una acción apropiada
          this.errorMessage = 'Agregar Entradas A la Compra.';
          return;
        }
        const datosCompra = this.localidadesSeleccionadas.map(localidad => ({
          codigoPartido: localidad.codigoPartido,
          codigoLocalidad: localidad.codigoLocalidad,
          nombreLocalidad: localidad.nombreLocalidad,
          precioLocalidad: localidad.precioLocalidad,
          cantidad: localidad.cantidad,
          precioTotal : localidad.cantidad*localidad.precioLocalidad
        }));
  
        this.$router.push({
          path: '/formVenta',
          query: { datosCompra: JSON.stringify(datosCompra) }
        });
  
        // Realizar acciones para finalizar la compra
        // Puedes enviar this.localidadesSeleccionadas a la siguiente pantalla, almacenarlo en el backend, etc.
  
        // Luego, puedes redirigir a la siguiente pantalla
      },
      decrementQuantity(localidad) {
        if (localidad.cantidad > 0) {
          localidad.cantidad--;
        }
      },
      incrementQuantity(localidad) {
        if (localidad.cantidad < localidad.DISPONIBILIDAD || localidad.cantidad == '') {
          localidad.cantidad++;
        }
      }
  
    }
  };
  
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
    /* Estilos generales */
  body {
    font-family: Arial, sans-serif;
    align-content: center;
    background-image: url('https://cdn.wallpapersafari.com/59/61/wScxR0.jpg');
    background-size: cover;
  }
  input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .error-message {
    background-color: rgba(0, 0, 0, 0.7); /* Color de fondo negro con transparencia */
    color: rgb(214, 176, 65); /* Color del texto */
    padding: 10px; /* Espacio interno del recuadro */
    margin-bottom: 10px;
    font-size: medium;
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
  .final-button{
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #ffffff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .quantity-button{
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #ffffff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .card-button {
    display: block;
    padding: 10px 20px;
    margin-left: 30%;
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
  