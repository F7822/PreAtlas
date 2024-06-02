<template>
  <div>
    <h1>Gene Expression Analyze (GEA)Module</h1>
    <h2>Gene Expression distribution across cellular Clusters</h2>
    <select v-model='selectedOrgan'>
        <option v-for="organ in organs" :key="organ">{{organ}}</option>
    </select>
    <select v-model='selectedProjectID'>
        <option v-for="id in ids" :key="id">{{id}}</option>
    </select>
    <select v-model='selectedGene'>
        <option v-for="gene in genes" :key="gene">{{gene}}</option>
    </select>
    <div ref="chart1" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name:'GEAPage',  
    data() {
        return {
            UMAPData:[],
            organs:[],
            filteredOrganData:[],
            ids:[],
            filteredIDData:[],
            genes:[],
            filteredGeneData:[],
            selectedOrgan: null,
            selectedProjectID: null,
            selectedGene: null
        }
    },
    created() {
        this.loadData();
    },
    mounted() {
        this.$nextTick(() => {
        this.initUMAPChart();
        });
    },
    watch: {
        selectedOrgan: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        },
        selectedProjectID: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        },
        selectedGene: {
            handler: function(newVal) {
            if (newVal !== null) {
                this.filterData();
            }
            },
            immediate: true
        }
    },
    beforeUnmount() {
        this.disposeCharts();
    },
    methods: {
        loadData() {
            this.UMAPData = [],
            this.organs = [],
            this.filteredOrganData = [],
            this.ids = [],
            this.filteredIDData = [],
            this.genes = [],
            this.filteredGeneData = [],
            this.clusters = [],
            this.fliteredClusterData = [],
            axios.get('http://localhost:4001/api/GEA/UMAP-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.UMAPData = response.data;
                        console.log("UMAP:",this.UMAPData),
                        this.organs = Array.from(new Set(this.UMAPData.map(item => item['Organ'])));
                        console.log('Organ:',this.organs);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
        filterData(){
            if(this.selectedOrgan) {
                this.filteredOrganData = this.UMAPData.filter(item => item['Organ'] === this.selectedOrgan);
                console.log("filteredOrgan:",this.filteredOrganData);
                this.ids = Array.from(new Set(this.filteredOrganData.map(item => item['Project ID'])));
                console.log("ids:",this.ids);
                if(this.selectedProjectID) {
                    this.filteredIDData = this.filteredOrganData.filter(item => item['Project ID'] === this.selectedProjectID);
                    this.genes = Array.from(new Set(this.filteredIDData.map(item => item['Gene'])));
                    if(this.selectedGene) {
                        this.filteredGeneData = this.filteredIDData.filter(item => item['Gene'] === this.selectedGene);
                        console.log("final:",this.filteredGeneData);
                    }
                }
            }
            this.initUMAPChart();
        },
        createOption1(Data) {
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'value',
                    scale: true
                },
                yAxis: {
                    type: 'value',
                    scale: true
                },
                visualMap: {
                    show: true, // 显示视觉映射组件
                    type: 'continuous', // 设置为连续类型
                    calculable: true, // 允许用户通过滑块计算数值
                    min: -5, // 设置最小值
                    max: 5, // 设置最大值
                    color: ['red','purple','black'], // 设置颜色渐变范围
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                {
                    name: 'Gene Expression',
                    type: 'scatter',
                    data: Data.map(item => [parseFloat(item['Component 1']), parseFloat(item['Component 2']), parseFloat(item['Value'])])
                }
                ]
            };
            return option;
        },
        initChart(refName, option) {
            let chart = echarts.init(this.$refs[refName]);
            chart.setOption(option);
            return chart;
        },
        initUMAPChart() {
            const option1 = this.createOption1(this.filteredGeneData || []);
            this.chart1 = this.initChart('chart1', option1)
        },
        disposeCharts() {
        if (this.chart1) 
            this.chart1.dispose();
        }
    }
};
</script>

<style>
/* 可以添加一些样式 */
</style>



