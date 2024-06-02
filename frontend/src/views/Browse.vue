<template>
    <div class="browse-container">
        <select v-model='selectedOrgan'>
            <option v-for="organ in organs" :key="organ">{{organ}}</option>
        </select>
        <div class="browse-content">
            <div class="select">select experiment type</div>     
            <div class="buttons">
                <router-link :to="{ name: 'BrowsePage', query: { mode: 'curated-knowledge'}}"> Curated Knowledge </router-link>
                <router-link :to="{ name: 'BulkBrowse', query: { mode: 'bulk' }}"> Bulk </router-link>
                <router-link :to="{ name: 'SCBrowse', query: { mode: 'single-cell' }}"> Single-Cell </router-link>
            </div>
            <table v-if="selectedOrgan" class="table">
                <thead>
                    <tr>
                        <th v-if="mode==='bulk'||mode==='single-cell'">Project ID</th>
                        <th v-if="mode==='bulk'||mode==='single-cell'">Accession ID</th>
                        <th>Organ</th>
                        <th v-if="mode==='bulk'||mode==='single-cell'">Disease Lesions</th>
                        <th v-if="mode==='bulk'">Organism</th>
                        <th v-if="mode==='bulk'">Data Type</th>
                        <th v-if="mode==='bulk'">Sample Count</th>
                        <th v-if="mode==='single-cell'">Cell Count</th>
                        <th v-if="mode==='single-cell'">Cell Clusters</th>
                        <th v-if="mode==='single-cell'">Cell Cluster Count</th>
                        <th v-if="mode==='curated-knowledge'">Disease ID</th>
                        <th v-if="mode==='curated-knowledge'">Disease Name</th>
                        <th v-if="mode==='curated-knowledge'">Disease ID(UMLS)</th>
                        <th>Detail</th>
                        <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for= "(item,index) in filteredData" :key="index">
                        <td v-if="mode==='bulk'||mode==='single-cell'">{{item['Project ID']}}</td>
                        <td v-if="mode==='bulk'||mode==='single-cell'">
                            <a v-if="item['Accession ID(link)']" :href="item['Accession ID(link)']" target="_blank">
                                {{ item['Accession ID'] }}
                            </a>
                            <span v-else>
                                {{ item['Accession ID'] }}
                            </span>
                        </td>
                        <td>{{item['Organ']}}</td>
                        <td v-if="mode==='bulk'||mode==='single-cell'">{{item['Disease Lesions']}}</td>
                        <td v-if="mode==='bulk'">{{item['Organism']}}</td>
                        <td v-if="mode==='bulk'">{{item['Data Type']}}</td>
                        <td v-if="mode==='bulk'">{{item['Sample Count']}}</td>
                        <td v-if="mode==='single-cell'">{{item['Cell Count']}}</td>
                        <td v-if="mode==='single-cell'">{{item['Cell Clusters']}}</td>
                        <td v-if="mode==='single-cell'">{{item['Cell Cluster Count']}}</td>
                        <td v-if="mode==='curated-knowledge'">{{item['Disease ID']}}</td>
                        <td v-if="mode==='curated-knowledge'">{{item['Disease Name']}}</td>
                        <td v-if="mode==='curated-knowledge'">
                            <div v-for="umlsId in item['Disease ID (UMLS)'].split('|')" :key="umlsId">
                                <a :href="'http://uts.nlm.nih.gov/uts/umls/concept/' + umlsId" target="_blank">
                                {{ umlsId }}
                                </a>
                            </div>
                        </td>
                        <td v-if="mode==='curated-knowledge'">View</td>
                        <td v-if="mode==='bulk'">
                            <router-link :to="{ name: 'BulkPage', query: { projectID: item['Project ID'] }}" target="_blank">View</router-link>
                        </td>
                        <td v-if="mode==='single-cell'">
                            <router-link :to="{ name: 'SingleCellPage', query: { projectID: item['Project ID'] }}" target="_blank">View</router-link>
                        </td>
                        <td>{{item['Reference']}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name:'BrowsePage',
    data(){
        return{
            browsedata:[],
            organs:[],
            selectedOrgan:null,
            mode:'curated-knowledge'
        };
    },
    created(){
        this.loadExcelData(this.getModeFromQuery());
    },
    methods:{
        getModeFromQuery() {
            return this.$route.query.mode||'curated-knowledge';
        },
        loadExcelData(mode) {
            this.browsedata = [];
            let apiUrl = '';
            switch(mode) {
                case 'bulk':
                    apiUrl = 'http://localhost:4001/api/bulk';
                    break;
                case 'single-cell':
                    apiUrl = 'http://localhost:4001/api/single-cell';
                    break;
                default:
                    apiUrl = 'http://localhost:4001/api/curated-knowledge';
            }
            axios.get(apiUrl)
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.browsedata = response.data;
                        this.organs = Array.from(new Set(this.browsedata.map(item => item.Organ)));
                        console.log("mode:",mode);
                        console.log("data:",this.browsedata);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
    },
    watch: {
        '$route.query.mode': function(newMode) {
            this.mode = newMode; // Update local mode
            this.loadExcelData(this.mode);
        },
    },
    computed:{
        filteredData(){
            return this.selectedOrgan?this.browsedata.filter(item=>item.Organ===this.selectedOrgan)
            :this.browsedata;
        },
    },


};
</script>

<style scoped>
.browse-container{
    display:flex;
    flex-direction: row;
    padding: 10px;
    
}

.browse-content{
    border-right: 5px;
    flex-direction: column;
    color:black;
    background-color: rgb(175, 172, 172);
}
.select{
    font-size:bold;
    align-self:flex-start;
}
.buttons{
    padding:15px;
    align-self:flex-start;
    margin:5px 5px;
}

.table{
  width:400px;
  border-collapse: inherit;
  margin-right:auto;
}

.table th,.table td{
  border:1px solid #040404;
  width:400px;
  padding:10px;
  text-align:center;
}

.table th{
  font-weight:200;
  font-size:30px;
}

.table td{
  font-size:15px;
}

</style>