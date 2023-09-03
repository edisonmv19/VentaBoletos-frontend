<template>
    <div v-if="usuarioLogueado" class="register-container">
    <div class="register-box">
      <h2>Cambio de Contraseña</h2>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> 
      <div class="form-columns">
        <div class="column">


          

          <label for="password">Contraseña Actual:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div class="column">
          

          <label for="newPassword">Nueva Contraseña:</label>
          <input type="password" id="newPassword" v-model="newPassword" >
          <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" >
        </div>
      </div>
      <button type="submit" @click="submitForm">Cambiar Clave</button><p></p>
    </div>
  </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        errorMessage: '',
        password: '',
        usuarioLogueado :null
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
      submitForm() {
        if(this.usuarioLogueado.contrasena === this.password){
            if(this.newPassword == this.confirmPassword){
                const url = 'http://localhost:3000/cambio-clave';
                const data = {
                userid: this.usuarioLogueado.id_usuario,
                password: this.newPassword
                };
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        if (responseData.error) {
                        // Mostrar mensaje de error si las credenciales son incorrectas
                        this.errorMessage = 'Usuario o contraseña incorrectos.';
                        } else {
                        console.log('Respuesta del servidor:', responseData);
                        this.$router.push('/');
                        }
                    })
                    .catch(error => {
                        console.error('Error al enviar la solicitud:', error);
                    });
            }else{
               this.errorMessage = 'Contraseñas no coinciden'
            }
            
        }else{
            console.log(this.usuarioLogueado.contrasena);
            this.errorMessage = 'Contraseñas actual Incorrecta'
            return;
        }
        /*const url = 'http://localhost:3000/login';
    const data = {
      user: this.user,
      password: this.password
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.error) {
          // Mostrar mensaje de error si las credenciales son incorrectas
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else {
          console.log('Respuesta del servidor:', responseData);
          this.$router.push('/partidos');
        }
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
      });*/
      }
    }
  };
  </script>
  <style scoped>
  body {
  font-family: Arial, sans-serif;
  align-content: center;
  background-image: url('https://cdn.wallpapersafari.com/59/61/wScxR0.jpg');
  background-size: cover;
}
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.register-box {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.error-message {
  color: red;
  margin-bottom: 10px;
}
.register-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.column {
  display: flex;
  flex-direction: column;
}

.register-box label {
  margin-bottom: 10px;
}

.register-box input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.register-box .phone-input {
  display: flex;
  align-items: center;
}

.register-box .phone-input span {
  margin-right: 5px;
}

.register-box button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.register-box a {
  text-align: center;
  margin-top: 10px;
  text-decoration: none;
  color: #744caf;
}

.register-box button:hover {
  background-color: #45a049;
}
</style>