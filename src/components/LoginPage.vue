<template>
  
  <div class="login-container">
    <div class="login-box">
      <img class="menu-image" src="https://cdn-icons-png.flaticon.com/512/188/188899.png" alt="Imagen de menú">
      <p></p>
      <h2>Iniciar sesión</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> 
      <form @submit.prevent="submitForm">
        <label for="user">Usuario:</label>
        <input type="text" id="user" v-model="user" required>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>

        <button type="submit">Iniciar sesión</button>
        <a href="/registro">Registrarse</a>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: '',
      errorMessage: '',
      password: ''
    };
  },
  methods: {
    submitForm() {
      const url = 'http://localhost:3000/login';
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
    });
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  align-content: center;
  background-size: cover;
}
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.error-message {
  color: red;
  margin-bottom: 10px;
  font-size: small;
}
.login-box {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 20px;
}

.login-box form {
  display: flex;
  flex-direction: column;
}

.login-box label {
  margin-bottom: 10px;
}

.login-box input {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.login-box button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}
.menu-image {
  display: block;
  width: 50%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
  margin-left: 25%;
}

.login-box a {
  text-align: center;
  margin-top: 10px;
  text-decoration: none;
  color: #744caf;
}

.login-box button:hover {
  background-color: #45a049;
}
</style>