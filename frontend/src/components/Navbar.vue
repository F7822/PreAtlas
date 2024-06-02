<template>
    <header>
        <img src="../assets/images/banner.png" alt="header image" class="header_image">
            <nav class ="navbar">
                <ul class="nav-list">
                    <li v-for="(item, index) in menuItems" :key="index" class="nav-item">
                        <router-link :to="item.to" class="nav-link">
                            <img :src="item.icon" alt="Icon" class="nav-icon" />
                            <span class="nav-text">{{ item.text }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
    </header>
</template>

<script>
export default {
  name: 'HeaderNavbar',
  data() {
    return {
      menuItems: [
        { to: '/', icon: '../assets/images/home.jpg', text: 'Home' },
        { to: '/browse', icon: '../assets/images/browse.jpg', text: 'Browse' },
        { to: '/search', icon: '../assets/images/search.jpg', text: 'Search' },
        { to: '/analyze', icon: '../assets/images/analyze.jpg', text: 'Analyze' },
        { to: '/download', icon: '../assets/images/download.jpg', text: 'Download' },
        { to: '/documentation', icon: '../assets/images/documentation.jpg', text: 'Documentation' },
        { to: '/contact', icon: '../assets/images/contact.jpg', text: 'Contact' },
      ]
    };
  }
};
</script>

<style scoped>
.header_image{
  width:100%;
  height: 100px;
  max-height: 100%;
  object-fit: cover; 
  object-position: center;
  vertical-align: top;
}
.navbar {
  background-color: rgb(10, 11, 27);
  display: flex;
  justify-content: center;
}

.nav-list {
  list-style: none;
  padding: 0;
  display: flex;
}

.nav-item {
  padding: 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nav-icon {
  margin-right: 5px;
  width: 20px; 
}

.nav-text {
    color: white;
    font-size:15px
}
</style>
