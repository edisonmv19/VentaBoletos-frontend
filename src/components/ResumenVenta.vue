<template>
  
    <div class="container">
      

      <div >
    
    <div class="card">
      <h2 v-if="localidades && localidades.length > 0">Resumen {{ this.localidades[0].EQUIPO_LOCAL }} VS {{ this.localidades[0].EQUIPO_VISITA }}</h2>
      
        <table>
        <thead>
          <tr>
            <th>LOCALIDAD</th>
            <th>CANTIDAD</th>
            <th>RECAUDACION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="localidad in localidades" :key="localidad.CODIGO_LOCALIDAD">
            <td>{{ localidad.NOMBRE }}</td>
            <td>{{ localidad.Vendidos }}</td>
            <td>{{ localidad.TotalRecaudado }}</td>
          </tr>
          <tr>
            <td></td>
            <td><b>TOTAL:</b></td>
            <td><b>{{calcularTotalCompra() }} $</b></td>
          </tr>
        </tbody>
      </table>
      <p></p>
      <div >
    
    <h2>Detalles de Compras</h2>
    <table>
      <thead>
          <tr>
            <th>CODIGO COMPRA</th>
            <th>LOCALIDAD</th>
            <th>CANTIDAD</th>
            <th>TOTAL</th>
            <th>USUARIO</th>
          </tr>
        </thead>
      <tbody>
        <tr v-for="compra in compras" :key="compra.CODIGO_COMPRA">
            <td>{{ compra.CODIGO_COMPRA }}</td>
            <td>{{ compra.NOMBRE }}</td>
            <td>{{ compra.CANTIDAD }}</td>
            <td>{{ compra.TOTAL }}</td>
            <td>{{ compra.email }}</td>
          </tr>
      </tbody>
    </table>
</div><p></p>
      <button class="final-button" @click="finalizarCompra">Volver</button><p></p>
    </div>
  </div>
  <!---->
  <div>
      <button @click="generarPDF">Exportar a PDF</button>
    </div>

  <div style="display: none;">
    <!-- Tabla 1 -->
    <table ref="tabla1" style="width: 100%;">
      <h2 v-if="localidades && localidades.length > 0">Resumen {{ localidades[0].EQUIPO_LOCAL }} VS {{ localidades[0].EQUIPO_VISITA }}</h2>
      <thead>
        <tr>
          <th style="width: 5%;">LOCALIDAD</th>
          <th style="width: 7%;">CANTIDAD</th>
          <th style="width: 7%;">RECAUDACION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="localidad in localidades" :key="localidad.CODIGO_LOCALIDAD">
          <td>{{ localidad.NOMBRE }}</td>
          <td>{{ localidad.Vendidos }}</td>
          <td>{{ localidad.TotalRecaudado }}</td>
        </tr>
        <tr>
          <td></td>
          <td><b>TOTAL:</b></td>
          <td><b>{{ calcularTotalCompra() }} $</b></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="display: none;">
    <!-- Tabla 2 -->
    <table ref="tabla2" style="width: 100%;">
      <h2>Detalles de Compras</h2>
      <thead>
        <tr>
          <th style="width: 15%;">CODIGO COMPRA</th>
          <th style="width: 25%;">LOCALIDAD</th>
          <th style="width: 15%;">CANTIDAD</th>
          <th style="width: 15%;">TOTAL</th>
          <th style="width: 30%;">USUARIO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="compra in compras" :key="compra.CODIGO_COMPRA">
          <td>{{ compra.CODIGO_COMPRA }}</td>
          <td>{{ compra.NOMBRE }}</td>
          <td>{{ compra.CANTIDAD }}</td>
          <td>{{ compra.TOTAL }}</td>
          <td>{{ compra.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>


    </div>
  </template>
  
  <script>
  import jsPDF from 'jspdf';

  export default {
    name: 'ResumenVenta',
    data() {
      return {
        localidades: [],
        compras:[]
      };
    },
    mounted() {
      const codigoPartido = this.$route.params.codigoPartido;
      const url = `http://localhost:3000/resumen-partidos/${codigoPartido}`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.localidades = data;
        })
        .catch(error => {
          console.error('Error al obtener las localidades:', error);
        });
        fetch(`http://localhost:3000/compras-partido/${codigoPartido}`)
    .then(response => response.json())
    .then(data1 => {
        this.compras = data1;
    })
    .catch(error => {
      console.error('Error al obtener el usuario logueado:', error);
    });
    },
    methods:{
      generarPDF() {
        const doc = new jsPDF();

// Acceder a las tablas mediante sus referencias
const tabla1 = this.$refs.tabla1;
const tabla2 = this.$refs.tabla2;

// Generar el PDF con el contenido de las tablas
doc.html(tabla1, {
  callback: function (doc) {
    // Guardar el PDF con el nombre "resumen1.pdf"
    doc.save('resumen1.pdf');
  },
  margin: [5, 5, 5, 5],
  x: 1,
  y: 1
});

doc.addPage(); // Agregar una nueva página para la segunda tabla
doc.html(tabla2, {
  callback: function (doc) {
    // Guardar el PDF con el nombre "resumen2.pdf"
    doc.save('resumen2.pdf');
  },
  margin: [15, 15, 15, 15],
  x: 10,
  y: 10
});
  },
      finalizarCompra(){
        this.$router.push('/lista-resumen');
      },
      comprarEntradasLocalidad(codigoPartido, codigoLocalidad) {
        // Redireccionar a la siguiente página con los códigos de partido y localidad en la URL
        this.$router.push(`/formVenta/${codigoPartido}/${codigoLocalidad}`);
      },
      calcularTotalCompra() {
      let total = 0;
      for (const dato of this.localidades) {
        total += dato.TotalRecaudado;
      }
      return total;
    },
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
   