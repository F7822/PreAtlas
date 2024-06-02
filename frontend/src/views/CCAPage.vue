<template>
  <div>
    <h1>Cellular Component Analyze (CCA) Module</h1>
    <h2>G Cellular distribution across lesions</h2>
    <select v-model='selectedOrgan1'>Organ
        <option v-for="organ in organs1" :key="organ">{{organ}}</option>
    </select>
    <select v-model='selectedProjectID1'>Project ID
        <option v-for="id in ids1" :key="id">{{id}}</option>
    </select>
    <div ref="chart1" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name:'CCAPage',  
    data() {
    return {
        boxplotData1:[],
        seriesData1: {},
        organs1:[],
        filteredOrganData1:[],
        ids1:[],
        filteredIDData1:[],
        selectedOrgan1: null,
        selectedProjectID1: null,
    };
  },
  created(){
    this.fetchboxPlotData1();
  },
  watch: {
        selectedOrgan1: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        },
        selectedProjectID1: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        }
    },
  mounted() {
    this.$nextTick(() => {
      this.initBoxplotChart1()
    });
  },
  beforeUnmount() {
    this.disposeCharts();
  },
  methods: {
    fetchboxPlotData1(){
            this.boxPlotData1=[];
            axios.get('http://localhost:4001/api/CCA/bulk-boxplot-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.boxplotData1 = response.data;
                        console.log("box:",this.boxplotData1);
                        this.organs1 = Array.from(new Set(this.boxplotData1.map(item => item['Organ'])));
                        }
                    })
            .catch(error => {
                console.error('Error:', error);
            });
    },
    filterData(){
        if(this.selectedOrgan1) {
            this.filteredOrganData1 = this.boxplotData1.filter(item => item['Organ'] === this.selectedOrgan1);
            this.ids1 = Array.from(new Set(this.filteredOrganData1.map(item => item['Project ID'])));
            if(this.selectedProjectID1) {
                this.filteredIDData1 = this.filteredOrganData1.filter(item => item['Project ID'] === this.selectedProjectID1);
                console.log("data1:",this.filteredIDData1);
            }
        }
        this.seriesData1 = this.filteredIDData1.reduce((result, item) => {
            if (!result[item['Disease Name']]) {
                result[item['Disease Name']] = [];
            }
            result[item['Disease Name']].push({
                name: item['Cell Type'],
                value: item['Composition']
            });
            return result;
        }, {});
        console.log("seris:",this.seriesData1);
        this.initBoxplotChart1();
    },
    createOption1() {
        let xAxisData = Object.keys(this.seriesData1);
        let legendData = Array.from(new Set(this.seriesData1[xAxisData[0]].map(item => item.name)));
        let seriesData = this.seriesData1[xAxisData[0]].map(cellTypeItem => {
            return {
                name: cellTypeItem.name,
                type: 'bar',
                stack: 'cellType',
                data: xAxisData.map(diseaseName => {
                    let composition = this.seriesData1[diseaseName].find(item => item.name === cellTypeItem.name)?.value || 0;
                    return [diseaseName, composition];
                })
            };    
        });
        let option = {
            title: {
                text:'Boxplot plot (CIBERSORTx based on bulk data)',
                left:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legendData,
                bottom:'bottom'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '35%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: seriesData
        };
        return option;
    },
    initBoxplotChart1(){
    if(this.filteredIDData1 && this.filteredIDData1.length>0){
        const option1 = this.createOption1();
        this.chart1 = this.initChart('chart1',option1);
    }
    else{
        console.error('Boxplot data is not ready.');
    }
},
    initChart(refName, option) {
      let chart = echarts.init(this.$refs[refName]);
      chart.setOption(option);
      return chart;
    },
    disposeCharts() {
      if (this.chart1) this.chart1.dispose();
    }
  }
};
</script>

<style>
/* 可以添加一些样式 */
</style>



