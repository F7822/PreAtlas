<template>
  <div>
    <h1>Dataset ID:{{projectID}}</h1>
    <div ref="chart1" style="width: 600px;height:400px;"></div><!--pieChart-->
    <select v-model='selectedDiseaseName'>
        <option v-for="disease in diseaseNameData2" :key="disease">{{disease}}</option>
    </select>
    <div ref="chart2" style="width: 600px;height:400px;"></div><!--volcanoChart-->
    <div ref="chart3" style="width: 600px;height:400px;"></div><!--lineChart-->
    <div ref="chart4" style="width: 600px;height:400px;"></div><!--columnChart-->
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
export default {
    name:'BulkPage',  
    data(){
        return {
            pieData:[],
            lineData:[],
            volcanoData:[],
            columnData:[],
            projectID:this.$route.query.projectID,
            xAxisData3: [],
            seriesData3: {},
            seriesData4: {},
            diseaseNameData2:[],
            selectedDiseaseName:null,
        };
    },
    mounted() {
        this.$nextTick(() => {
        this.fetchPieData();
        this.fetchLineData();
        this.fetchVolcanoData();
        this.fetchColumnData();
        });
    },
    beforeUnmount() {
        this.disposeCharts();
    },
    methods: {
        fetchPieData(){
            this.pieData=[];
            axios.get('http://localhost:4001/api/bulk/pie-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        let filteredData = response.data.filter(item=>item['Project ID']===this.projectID);
                        this.pieData = filteredData.map(item=>{
                            return{
                                value:item['Sample Count'],
                                name:item['Disease Name']
                            };
                        });
                        this.initPieChart();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        fetchLineData(){
            this.lineData=[];
            axios.get('http://localhost:4001/api/bulk/line-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.lineData = response.data.filter(item=>item['Project ID']===this.projectID);
                        console.log('lineData:',this.lineData);
                        this.initLineChart();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        fetchVolcanoData(){
            this.volcanoData=[];
            axios.get('http://localhost:4001/api/bulk/volcano-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.volcanoData = response.data.filter(item=>item['Project ID']===this.projectID);
                        this.diseaseNameData2 = Array.from(new Set(this.volcanoData.map(item => item['Disease Name'])));
                        console.log('volcanoData:',this.volcanoData);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        fetchColumnData(){
            this.columnData=[];
            axios.get('http://localhost:4001/api/bulk/column-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.columnData = response.data.filter(item=>item['Project ID']===this.projectID);
                        this.seriesData4 = this.columnData.reduce((result, item) => {
                            if (!result[item['Disease Name']]) {
                                result[item['Disease Name']] = [];
                            }
                            result[item['Disease Name']].push({
                                name: item['Cell Type'],
                                value: item['Composition']
                            });
                            return result;
                        }, {});
                        this.initColumnChart();
                        }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        filterVolcanoDataByDisease(diseaseName) {
            return this.volcanoData.filter(item => item['Disease Name'] === diseaseName);
        },
        createOption2(filteredData) {
            const upRegulatedData = filteredData.filter(item => item['Color.列表不显示.'] === 'up-regulated');
            const downRegulatedData = filteredData.filter(item => item['Color.列表不显示.'] === 'down-regulated');
            const nonSignificantData = filteredData.filter(item => item['Color.列表不显示.'] === 'non-significant');
            const seriesData = [
                {
                    name: 'up-regulated',
                    type: 'scatter',
                    data: upRegulatedData.map(item => [parseFloat(item['log2(FoldChange)']), parseFloat(item['log10(FDR)'])]),
                    itemStyle: {
                        color: 'red' // up-regulated 显示红色
                    }
                },
                {
                    name: 'down-regulated',
                    type: 'scatter',
                    data: downRegulatedData.map(item => [parseFloat(item['log2(FoldChange)']), parseFloat(item['log10(FDR)'])]),
                    itemStyle: {
                        color: 'black' // down-regulated 显示黑色
                    }
                },
                {
                    name: 'non-significant',
                    type: 'scatter',
                    data: nonSignificantData.map(item => [parseFloat(item['log2(FoldChange)']), parseFloat(item['log10(FDR)'])]),
                    itemStyle: {
                        color: 'grey' // non-significant 显示灰色
                    }
                }
            ];
            const option = {
                title: {
                    text: 'Volcano plot for DEGs',
                    left: 'center'
                    },
                    /*tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        if (!params || params.length === 0) {
                            return '';
                        }
                        console.log("ss:",params);
                        return `<br/>Gene: ${params.seriesName}<br/>log2(FoldChange): ${params.data[0]}
                        <br/>log10(FDR): ${params.data[1]}`;
                    }
                    },*/
                    xAxis: {
                        name: 'Component 1',
                        nameLocation:'middle',
                        type: 'value'
                    },
                    yAxis: {
                        name:'Component 2',
                        type: 'value'
                    },
                    series: seriesData
                };
                return option;
        },
        initVolcanoChart() {
            const filteredData = this.filterVolcanoDataByDisease(this.selectedDiseaseName);
            const option2 = this.createOption2(filteredData);
            this.chart2 = this.initChart('chart2',option2);
        },
        createOption4() {
            let xAxisData = Object.keys(this.seriesData4);
            let legendData = Array.from(new Set(this.seriesData4[xAxisData[0]].map(item => item.name)));
            let seriesData = this.seriesData4[xAxisData[0]].map(cellTypeItem => {
            return {
            name: cellTypeItem.name,
            type: 'bar',
            stack: 'cellType',
            data: xAxisData.map(diseaseName => {
                let composition = this.seriesData4[diseaseName].find(item => item.name === cellTypeItem.name)?.value || 0;
                return [diseaseName, composition];
            })
        };    
            });
            let option = {
                title: {
                    text: 'TME cell types deconolution analysis',
                    subtext:'Column plot for deconvoluted TME cells',
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
        createOption3(){
            if (!this.lineData|| this.lineData.length === 0) {
                return;
            }
            const xAxisData3=new Set();
            this.seriesData3 = this.lineData.reduce((result, item) => {
                if (!xAxisData3.has(item['Disease Name'])) {
                    xAxisData3.add(item['Disease Name']);
                    this.xAxisData3.push(item['Disease Name']); // 横坐标数据
                }
                if (!result[item.Gene]) {
                result[item.Gene] = {
                    name: item.Gene,
                    type: 'line',
                    data: [],
                };
                }
                result[item.Gene].data.push({
                    value: item['Mean Expression Value'],
                    gene: item.Gene,
                    meanExpressionValue: item['Mean Expression Value'],
                    direction: item.Direction,
                    fdr: item.FDR,
                });
                return result;
            }, {});
            this.xAxisData3 = Array.from(xAxisData3);
            console.log('xAxis:',this.xAxisData3);
            console.log('serisdata:',this.seriesData3);
            const option={
                title: {
                    text: 'Dynamic genes across premaligant lesions',
                    subtext:'Line chart for top 5 dynamic genes(mean expression)',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (!params || params.length === 0) {
                            return '';
                        }
                        return `<br/>Gene: ${params.data.gene}<br/>Mean Expression: ${params.data.meanExpressionValue}
                        <br/>Direction: ${params.data.direction}<br/>P-Value(FDR): ${params.data.fdr}`;
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap:false,
                    data: this.xAxisData3,
                    axisLabel:{
                        interval:0
                    }
                },
                yAxis: {
                type: 'value'
                },
                series: Object.values(this.seriesData3),
            };
            return option;
        },
        initLineChart(){
            if(this.lineData && this.lineData.length>0){
                const option3 = this.createOption3();
                this.chart3 = this.initChart('chart3',option3);
            }
            else{
                console.error('Line data is not ready.');
            }
        },
        initColumnChart(){
            if(this.columnData && this.columnData.length>0){
                const option4 = this.createOption4();
                this.chart4 = this.initChart('chart4',option4);
            }
            else{
                console.error('Column data is not ready.');
            }
        },
        initPieChart() {
            let option1 = {
            title: {
                text: 'Sample counts for'+this.projectID,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                name: 'Disease',
                type: 'pie',
                radius: '50%',
                data: this.pieData,
                itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
            };
            this.chart1 = this.initChart('chart1', option1);
            if (this.chart1) {
                this.chart1.on('error', function (err) {
                console.error(err);
            });
            }
        },
        initChart(refName, option) {
            let chart = echarts.init(this.$refs[refName]);
            chart.setOption(option);
            return chart;
        },
        disposeCharts() {
            if (this.chart1) this.chart1.dispose();
            if (this.chart2) this.chart2.dispose();
            if (this.chart3) this.chart3.dispose();
            if (this.chart4) this.chart4.dispose();
        }
    },
    watch:  {
            selectedDiseaseName:function(){
                this.initVolcanoChart();
            }
            },
};
</script>

<style>

</style>



