
<template>
  
    <div class="container">
      

      <div v-if="datosCompra.length > 0">
    
    <div class="card">
      <h2>Detalles de la Compra</h2>
      <table>
        <thead>
          <tr>
            <th>LOCALIDAD</th>
            <th>CANTIDAD</th>
            <th>PRECIO UNIT.</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dato, index) in datosCompra" :key="index">
            <td>{{ dato.nombreLocalidad }}</td>
            <td>{{ dato.cantidad }}</td>
            <td>{{ dato.precioLocalidad }}</td>
            <td>{{ dato.precioTotal }}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td><b>TOTAL:</b></td>
            <td><b>{{calcularTotalCompra() }} $</b></td>
          </tr>
        </tbody>
      </table>
      <p></p>
      <div v-if="usuarioLogueado">
    
    <h2>Detalles del Comprador</h2>
    <table>
      
      <tbody>
        
        <tr>
          <td><b>Nombre:</b></td>
          <td>{{ usuarioLogueado.nombre }}&nbsp; {{ usuarioLogueado.apellido }}</td>
        </tr>
        <tr>
          <td><b>Usuario:</b></td>
          <td>{{ usuarioLogueado.usuario}}</td>
        </tr>
        <tr>
          <td><b>Email:</b></td>
          <td>{{ usuarioLogueado.email}}</td>
        </tr>
        <tr>
          <td><b>Telefono:</b></td>
          <td>{{ usuarioLogueado.telefono }}</td>
        </tr>
      </tbody>
    </table>
</div><p></p>
      <button class="final-button" @click="finalizarCompra">Confirmar Compra</button><p></p>
      <button class="exit-button" @click="cancelarCompra">Cancelar Compra</button>
    </div>
  </div>
  
    </div>
  </template>
  
  <script>

  export default {
    name:'FormularioVenta',
    props: ['codigoPartido', 'codigoLocalidad'],
    computed: {
    datosCompra() {
      const datosCompra = this.$route.query.datosCompra;
      return datosCompra ? JSON.parse(datosCompra) : [];
    }
  },
    data() {
      return {
        partido:'',
        localidad:'',
        cantidad: 1,
        nombre: '',
        correo: '',
        usuarioLogueado: null,
        codigoFactura: null
      };
      
    },
    mounted() {
        
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
      
      cancelarCompra(){
        this.$router.push('/partidos');
      },
      calcularTotalCompra() {
      let total = 0;
      for (const dato of this.datosCompra) {
        total += dato.precioTotal;
      }
      return total;
    },
    
    generarFactura() {
    // Datos que se enviarán en la solicitud POST
    const data = {
      idUsuario: this.usuarioLogueado.id_usuario
    };

    // URL del endpoint en el backend para generar la factura
    const url = 'http://localhost:3000/generar-factura';

    // Realizar la solicitud POST para generar la factura
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        // Retornar el código de la factura generado en la respuesta
        this.codigoFactura = responseData.codigoFactura;
        return responseData.codigoFactura;
      })
      .catch(error => {
        console.error('Error al generar la factura:', error);
        // Realiza acciones apropiadas en caso de error
        throw error; // Puedes relanzar el error para manejarlo en el método finalizarCompra()
      });
  },
  finalizarCompra() {
    // Generar la factura y obtener el código de la factura generada
    this.generarFactura()
      .then(codigoFactura => {
        // Aquí ya tienes el código de la factura generado, puedes utilizarlo como necesites
        console.log('Código de factura generado:', codigoFactura);

        // Agregar el código de la factura a los datos de la compra
        for (const dato of this.datosCompra) {
          dato.codigoFactura = this.codigoFactura;
        }

        // Iniciar la recursiva para enviar las solicitudes de compra
        this.enviarSolicitud(0);
      })
      .catch(error => {
        console.error('Error al generar la factura:', error);
        // Realiza acciones apropiadas en caso de error
      });
  },
finalizarCompra1(){
  this.enviarSolicitud(0);
}
,
  enviarSolicitud(index) {
    if (index < this.datosCompra.length) {
      const dato = this.datosCompra[index];
      this.submitForm(dato)
        .then(() => {
          this.enviarSolicitud(index + 1); // Llama a la función para el siguiente dato
        })
        .catch(error => {
          console.error('Error al enviar la solicitud:', error);
          // Realiza acciones apropiadas en caso de error
        });
    } else {
      this.$router.push('/compra-completa');
    }
  },
  submitForm(dato) {
    const url = 'http://localhost:3000/compra-entradas';
    const data = {
      codigoPartido: dato.codigoPartido,
      codigoLocalidad: dato.codigoLocalidad,
      cantidad: dato.cantidad,
      idUsuario: this.usuarioLogueado.id_usuario,
      total: dato.precioTotal,
      codigoFactura : dato.codigoFactura
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
  }
    }
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  .card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  align-content: center;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}
  
  form {
    width: 300px;
  }
  
  label {
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
  }
  .exit-button {
  margin-left: 32%;
  padding: 10px 20px;
  background-color: #f44336;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}
.final-button{
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
}
  
  </style>
  