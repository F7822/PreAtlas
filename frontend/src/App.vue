<template>
  <div id="app">
    <HeaderNavbar />
    <router-view />
    <ul>
      <li v-for="message in messages" :key="message._id">{{ message.text }}</li>
    </ul>
    <!--<HomePage></HomePage>-->
  </div>
</template>

<script>
import axios from 'axios';
import HeaderNavbar from './components/Navbar.vue';
import router from './router/router';

export default {
  name: 'App',
  data(){
    return{
      messages:[],
    };
  },
  components: {
    HeaderNavbar,
  },
  router,
  created() {
    this.fetchMessages();
  },
  methods: {
      fetchMessages(){
        axios.get('http://localhost:4001/messages')
        .then(response => {
          this.messages=response.data;
        })
        .catch(error=>{
          console.error('Error',error);
        });
      }
    }
};

</script>

<style>
/* 全局样式 */
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
