<template>
  <div class="container">
    <!-- Menú lateral -->
    <div class="menu-bar">
      <img class="menu-image" src="https://cdn-icons-png.flaticon.com/512/188/188899.png" alt="Imagen de menú">
      <p></p>
      <div v-if="usuarioLogueado"><b>Selección de Localidades</b></div>
      <p></p>
      <router-link class="menu-button" to="/partidos">Partidos</router-link>
      <router-link class="menu-button" to="/lista-resumen">Resumen Ventas</router-link>
      <router-link class="menu-button" to="/gestion-procesos">Gestion Procesos</router-link>
      <router-link class="menu-button" to="/gestion-procesos">Gestion Procesos</router-link>
      <a class="exit-button" href="/">Salir</a>
    </div>

    <!-- Contenido principal -->
    <div class="content">
      <h1 style="color: aliceblue;">Localidades del partido {{ this.$route.params.codigoPartido }}</h1>
      <div v-if="errorMessage" class="error-message"><b>{{ errorMessage }}</b></div> <p></p>
      <form @submit.prevent="agregarLocalidad" class="form-container">
  <div class="form-column">
    <div class="card">
      <p></p><p></p>
      <img class="card-image" src="../IMG/ESTADIO.png" alt="Imagen de menú">
      <label for="localidad"><b>Seleccione la Localidad: </b></label>
      <select id="localidad" class="selectsbox" v-model="localidadSeleccionada" @change="obtenerAsientosDeLocalidad(localidadSeleccionada)">
        <option value="">Seleccionar localidad</option>
        <option v-for="localidad in localidades" :key="localidad.CODIGO_LOCALIDAD" :value="localidad" class="selectsbox">{{ localidad.NOMBRE }}</option>
      </select>
    </div>
  </div>
  <div class="form-column" style="align-content: center;">
  <div v-if="localidadSeleccionada" class="card">
    <p></p>
    <h2 class="card-title">{{ localidadSeleccionada.NOMBRE }}</h2>
    <p class="card-description">Precio: <b>{{ localidadSeleccionada.PRECIO }} $</b></p>
    <p class="card-description">Disponibles: <b>{{ localidadSeleccionada.DISPONIBILIDAD }}</b></p>
    <div v-if="asientos.length > 0" class="asientos-picker">
      <img class="card-image2" src="../IMG/CANCHA.png" alt="Imagen de menú" style="padding-bottom: 5%;height: 50px;">
      <div class="row" v-for="(rowAsientos, rowIndex) in asientosGrouped" :key="rowIndex">
        
        <div v-for="asiento in rowAsientos" :key="asiento.ID" class="asiento" :class="{ 'asiento-seleccionado': asientosSeleccionados.includes(asiento.ID), 'asiento': asiento.ESTADO === 0, 'asiento-no-disponible': asiento.ESTADO === 1 }" @click="toggleSeleccionAsiento(asiento.ID)">
          {{ asiento.ID }}
        </div>
      </div>
    </div>
    <button class="final-button" type="submit"><b>Agregar al carrito</b></button>
  </div>
</div>
</form>
    </div>
    <p></p>
      <div v-if="localidadesSeleccionadas.length > 0" class="cardKart">
        <h2>Carrito de compra:</h2>
        <table>
    <thead>
      <tr>
        <th>Localidad</th>
        <th>Cantidad</th>
        <th>Precio Total</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(localidad, index) in localidadesSeleccionadas" :key="index">
        <td>{{ localidad.nombreLocalidad }}</td>
        <td>{{ localidad.cantidad }}</td>
        <td>{{ localidad.precioTotal }}</td>
        <td>
          <button class="exit-button" @click="eliminarLocalidad(index)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
      </div>

      <button class="final-button" @click="realizarCompra" v-if="localidadesSeleccionadas.length > 0">Continuar Compra</button>
    </div>
</template>

<script>
export default {
  name: 'LocalidadesTabla',
  data() {
    return {
      localidades: [],
      localidadSeleccionada: null,
      cantidad: 0,
      localidadesSeleccionadas: [],
      asientos: [],
      asientosSeleccionados: [],
      usuarioLogueado: null,
      errorMessage: ''
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
  methods: {
    toggleSeleccionAsiento(asientoID) {
    const asientocomprobar = this.asientos.find(asiento => asiento.ID === asientoID);
    if(asientocomprobar && asientocomprobar.ESTADO === 0){
      if (this.asientosSeleccionados.includes(asientoID)) {
      this.asientosSeleccionados = this.asientosSeleccionados.filter(id => id !== asientoID);
    } else {
      this.asientosSeleccionados.push(asientoID);
    }
    console.log('ID ASIENTOs EN ARREGLO:', this.asientosSeleccionados);
    }else{
      return;
    }

    
  },
  enviarSolicitud(index, asientos1, estado) {
    if (index < asientos1.length) {
      const dato = asientos1[index];
      console.log('ID ASIENTO:', asientos1[index]);
      this.submitForm(dato, estado)
        .then(() => {
          this.enviarSolicitud(index + 1, asientos1, estado); // Llama a la función para el siguiente dato
        })
        .catch(error => {
          console.error('Error al enviar la solicitud:', error);
          // Realiza acciones apropiadas en caso de error
        });
    } else {
      console.log('ID ASIENTO:', asientos1[index]);
    }
  },
  submitForm(dato,estado) {
    const url = 'http://localhost:3000/actualiza-asiento';
    const data = {
      ID: dato,
      ESTADO: estado
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('Respuesta del servidor:', responseData);
        // Realiza acciones apropiadas en caso de éxito
      });
  },
    obtenerAsientosDeLocalidad(localidad) {
    const url = `http://localhost:3000/asientos/${localidad.CODIGO_LOCALIDAD}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.asientos = data;
        this.asientosGrouped = [];
    let currentRow = [];
    for (let i = 0; i < this.asientos.length; i++) {
      currentRow.push(this.asientos[i]);
      if (currentRow.length === 10) {
        this.asientosGrouped.push(currentRow);
        currentRow = [];
      }
    }
    if (currentRow.length > 0) {
      this.asientosGrouped.push(currentRow);
    }
      })
      .catch(error => {
        console.error('Error al obtener los asientos:', error);
      });
    },
    eliminarLocalidad(index){
      const localidadEliminada = this.localidadesSeleccionadas[index];
      this.localidadesSeleccionadas.splice(index, 1);

      // Buscar la localidad en localidades usando su codigoLocalidad
      const localidadEncontrada = this.localidades.find(localidad => localidad.CODIGO_LOCALIDAD === localidadEliminada.codigoLocalidad);

      if (localidadEncontrada) {
        // Sumar la cantidad de la localidad eliminada a la disponibilidad
        localidadEncontrada.DISPONIBILIDAD += localidadEliminada.cantidad;
        this.enviarSolicitud(0,localidadEliminada.asientos, 0)
      }
      this.asientos=[];
      this.localidadSeleccionada = null;
      this.errorMessage = 'Item eliminado del Carrito';
    },
    agregarLocalidad() {
      this.cantidad = this.asientosSeleccionados.length;
      if (!this.localidadSeleccionada) {
        
        return;
      }
      if (this.asientosSeleccionados.length === 0) {
    this.errorMessage = 'Debe seleccionar al menos un asiento.';
    return;
  }
      if (this.cantidad <= 0) {
        this.errorMessage = 'El valor de entradas a Agregar no puede ser Igual a 0';
        return;
      }
      

      const localidad = this.localidadSeleccionada;

      const localidadSeleccionada1 = this.localidadesSeleccionadas.find(item => item.codigoLocalidad === localidad.CODIGO_LOCALIDAD);

      if (localidadSeleccionada1) {
        localidadSeleccionada1.cantidad += this.cantidad;
        localidadSeleccionada1.precioTotal = localidadSeleccionada1.cantidad * localidad.PRECIO;
        localidadSeleccionada1.asientos = localidadSeleccionada1.asientos.concat(this.asientosSeleccionados);
        console.log('Asientos combinador:', localidadSeleccionada1.asientos);
        localidad.DISPONIBILIDAD -= this.cantidad;

      } else {
        this.localidadesSeleccionadas.push({
          codigoPartido: localidad.PARTIDO_CODIGO,
          codigoLocalidad: localidad.CODIGO_LOCALIDAD,
          nombreLocalidad: localidad.NOMBRE,
          precioLocalidad: localidad.PRECIO,
          cantidad: this.cantidad,
          precioTotal: this.cantidad * localidad.PRECIO,
          asientos: this.asientosSeleccionados
          
        });
        console.log('Asientos agregados a localidad:', this.asientosSeleccionados);
        localidad.DISPONIBILIDAD -= this.cantidad;
      }
      this.errorMessage = 'Se agregó '+this.cantidad+' entrada(s) de '+localidad.NOMBRE+' al carrito!';
      this.localidadSeleccionada = null;
      this.cantidad = 0;


      this.enviarSolicitud(0,this.asientosSeleccionados,1);

      this.asientosSeleccionados=[];
      this.asientos=[];
      
    },
    realizarCompra() {
      if (this.localidadesSeleccionadas.length === 0) {
        return;
      }

      const datosCompra = this.localidadesSeleccionadas.map(localidad => ({
        codigoPartido: localidad.codigoPartido,
        codigoLocalidad: localidad.codigoLocalidad,
        nombreLocalidad: localidad.nombreLocalidad,
        precioLocalidad: localidad.precioLocalidad,
        cantidad: localidad.cantidad,
        precioTotal: localidad.precioTotal,
        codigoFactura : '68'
      }));

      this.$router.push({
        path: '/formVenta',
        query: { datosCompra: JSON.stringify(datosCompra) }
      });
    }
  }
};
</script>

<style>  /* Estilos generales */
body {
  font-family: Arial, sans-serif;
  align-content: center;
  background-image: url('https://images.ctfassets.net/hrltx12pl8hq/5KiKmVEsCQPMNrbOE6w0Ot/341c573752bf35cb969e21fcd279d3f9/hero-img_copy.jpg?fit=fill&w=600&h=400');
  background-size: cover;
}
input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
.selectsbox{
  
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
.card-image {
  display: block;
  width: 60%;
  max-height: 250px;
  max-width: 250px;
  object-fit: cover;
  margin-bottom: 20px;
  margin-left: 25%;
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
  max-height: 2500px;
  min-height: 250px;
}
.cardKart {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.form-container {
  display: flex;
  justify-content: space-between;
}

.form-column {
  flex: 1;
  margin-right: 10px;
}

.card-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.card-description {
  margin-bottom: 20px;
}
table {
  width: 75%;
  border-collapse: collapse;
  margin: 0 auto; /* Centrar la tabla */
  border-radius: 15px; /* Agregar bordes redondeados */
  overflow: hidden; /* Para ocultar los bordes redondeados si se desborda contenido */
  text-align: center;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* Estilos para los bordes verdes */
th, td {
  border: 1px solid green;
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
.asientos-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
  margin-bottom: 10px;
}

.asiento {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.asiento-seleccionado {
  background-color: #007bff;
  color: white;
}
.asiento-disponible {
  background-color:green; /* o cualquier otro estilo que desees para asientos disponibles */
  cursor: pointer;
}

.asiento-no-disponible {
  color: white;
  background-color: rgb(66, 60, 60); /* o cualquier otro estilo que desees para asientos no disponibles */
  cursor: not-allowed;
}

</style>
