<template>
  <div>
    <h1>Dynamic genes Analyze (DGA) Module</h1>
    <h2>Dynamic genes across lesions</h2>
    <select v-model='selectedOrgan2'>Organ
        <option v-for="organ in organs2" :key="organ">{{organ}}</option>
    </select>
    <select v-model='selectedProjectID2'>Project ID
        <option v-for="id in ids2" :key="id">{{id}}</option>
    </select>
    <div ref="chart2" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name:'DGAPage',  
    data() {
        return {
            LesionsData:[],
            organs2:[],
            filteredOrganData2:[],
            ids2:[],
            filteredIDData2:[],
            uniqueDiseases:[],
            selectedOrgan2: null,
            selectedProjectID2: null,
        }
    },
    created() {
        this.fetchtrajData();
    },
    watch: {
        selectedOrgan2: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        },
        selectedProjectID2: {
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
        this.fetchtrajData();
        });
    },
    beforeUnmount() {
        this.disposeCharts();
    },
    methods: {
        fetchtrajData() {
            this.LesionsData = [],
            this.organs2 = [],
            this.filteredOrganData2 = [],
            this.ids2 = [],
            this.filteredIDData2 = [],
            this.uniqueDiseases = [],
            axios.get('http://localhost:4001/api/DGA/traj-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.LesionsData = response.data;
                        this.organs2 = Array.from(new Set(this.LesionsData.map(item => item['Organ'])));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
        filterData(){
            if(this.selectedOrgan2) {
                this.filteredOrganData2 = this.LesionsData.filter(item => item['Organ'] === this.selectedOrgan2);
                this.ids2 = Array.from(new Set(this.filteredOrganData2.map(item => item['Project ID'])));
                console.log("filter:",this.filteredOrganData2);
                console.log("ids:",this.ids2);
                if(this.selectedProjectID2) {
                    this.filteredIDData2 = this.filteredOrganData2.filter(item => item['Project ID'] === this.selectedProjectID2);
                    this.processTrajData();
                }
            }
        },
        processTrajData(){
            const diseaseMap = new Map();
            const uniqueDiseases = new Set();
            this.filteredOrganData2.forEach(item => {
                const disease = item['Disease Lesion'];
                const component1 = parseFloat(item['component1']); // 转换为数值类型
                const component2 = parseFloat(item['component2']); // 转换为数值类型
                uniqueDiseases.add(disease);
                if (!diseaseMap.has(disease)) {
                    diseaseMap.set(disease, []);
                }
                diseaseMap.get(disease).push([component1, component2,disease]);
                });
            this.trajData = Array.from(diseaseMap.values());
            this.initTrajChart();
        },
        initTrajChart() {
            let option={
            title: {
                text: 'Lesions',
                left:'center'
            },
            grid: {
              left: '3%',
              right: '7%',
              bottom: '7%',
              containLabel: true
            },
            legend:{
              data:this.uniqueDiseases
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                hideDelay:100,
                formatter: function (params) {
                    var extraInfo = params.data[2]; 
                    if (params.length > 1) {
                      return (
                          `Multiple Points: <br/>`+
                          `Disease Lesion:${extraInfo}<br/>` +
                          `Component1:${params.data[0]}<br/>`+
                          `Component2:${params.data[1]}<br/>`
                      );
                  } else {
                      return (
                          `Single Point: <br/>` +
                          `Disease Lesion:${extraInfo}<br/>` +
                          `Component1:${params.data[0]}<br/>`+
                          `Component2:${params.data[1]}<br/>`
                      );
                    }
                },
                axisPointer: {
                    type: 'cross',
                }
            },
            xAxis: [
                {
                    type: 'value',
                    scale: true,
                    splitLine: {
                    show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    splitLine: {
                    show: false
                    }
                }
            ],
            series: this.trajData.map((data, index) => {
                return{name: `Disease Lesion ${index}`,
                symbolSize: 5,
                type: 'scatter',
                data: data.map(item => [...item.slice(0,2), `Disease Lesion ${item[2]}`])
                }})
            };
            this.$nextTick(() =>{
                this.chart5 = this.initChart('chart2', option);
            });
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



