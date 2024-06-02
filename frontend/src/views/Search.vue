<template>
    <AppNavbar/>
    <div class ="typecontainer">
        <div class ="gene">
            <h1>Search by Gene</h1>
            <h2>Search for a Gene</h2>
            <input type="text" v-model="geneSearch" placeholder="Enter gene name..." />
            <button @click="searchGene">Search</button>
        </div>
        <div class ="organ">
            <h1>Search by Organ</h1>
            <h2>Search for a Organ</h2>
            <input type="text" v-model="organSearch" placeholder="Enter organ name..." />
            <button @click="searchOrgan">Search</button>
        </div>
        <div class ="project">
            <h1>Search by Project</h1>
            <h2>Project ID</h2>
            <input type="text" v-model="projectSearch" placeholder="Enter project ID..." />
            <button @click="searchProject">Search</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchPage',
  data() {
    return {
      geneSearch: '',
      organSearch: '',
      projectSearch: '',
    };
  },
  /*
  methods: {
    searchGene() {
      console.log('Searching for gene:', this.geneSearch);
    },
    searchOrgan() {
      console.log('Searching for organ:', this.organSearch);
    },
    searchProject() {
      console.log('Searching for project ID:', this.projectSearch);
    },
  },*/
};
</script>

<style scoped>
.typecontainer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 50px;
}

.gene,.organ,.project {
  flex: 1; 
  padding: 0 20px;
}

.gene h1,.organ h1,.project h1 {
  align-self: center;
}

.gene h2,.organ h2,.project h2 {
  align-self: left;
}

input[type="text"] {
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369f7e;
}
</style>