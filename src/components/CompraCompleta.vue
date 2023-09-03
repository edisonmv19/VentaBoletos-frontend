<template>
  
    <div class="login-container">
      <div class="login-box">
        <img class="menu-image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/768px-Sign-check-icon.png" alt="Imagen de menú">
        <p></p>
        <h2>Compra Completada Con Exito!</h2>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> 
        <form @submit.prevent="submitForm">
          <button type="submit">Continuar</button>
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
          this.$router.push('/partidos');
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