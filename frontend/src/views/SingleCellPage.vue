<template>
  <div>
    <h1>Dataset ID:{{projectID}}</h1>
    <div ref="chart1" style="width: 600px; height: 400px;"></div><!--scatterChart-->
    <div ref="chart2" style="width: 600px; height: 400px;"></div><!--sactterChart-->
    <div ref="chart4" style="width: 600px; height: 400px;"></div><!--columnChart-->
    <div ref="chart5" style="width: 600px; height: 400px;"></div><!--trajChart-->
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name:'SingleCellPage',  
    data() {
          return {
          scatterData:[],
          cellScatterData:[],
          DiseaseScatterData:[],
          uniqueCellTypes:[],
          uniqueDiseaseLesions:[],
          columnData:[],
          seriesData4:[],
          trajData:[],
          uniqueDiseases:[],
          projectID:this.$route.query.projectID,
        };
    },
    mounted() {
        this.$nextTick(() => {
        this.fetchScatterData();
        this.fetchColumnData();
        this.fetchTrajData();
      });
    },
    beforeUnmount() {
        this.disposeCharts();
    },
    methods: {
        fetchScatterData(){
            this.scatterData = [];
            axios.get('http://localhost:4001/api/single-cell/scatter-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.scatterData = response.data.filter(item=>item['Project ID']===this.projectID);
                        console.log('scatterData:',this.scatterData);
                        this.catagorizeData();
                    }
                })
                .then(() => {
                  this.initScatterCharts();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        fetchColumnData(){
          this.colunmData = [];
            axios.get('http://localhost:4001/api/single-cell/column-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.columnData = response.data.filter(item=>item['Project ID']===this.projectID);
                        this.seriesData4 = this.columnData.reduce((result, item) => {
                            if (!result[item['Disease Lesion']]) {
                                result[item['Disease Lesion']] = [];
                            }
                            result[item['Disease Lesion']].push({
                                name: item['Cell Type'],
                                value: item['Cell Proportion']
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
        fetchTrajData(){
          this.trajData = [];
          axios.get('http://localhost:4001/api/single-cell/traj-chart')
                .then(response => {
                    if (response.data && response.data.length > 0) {
                        this.trajData = response.data.filter(item=>item['Project ID']===this.projectID);
                        this.processTrajData();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
          });
        },
        processTrajData(){
          const diseaseMap = new Map();
          const uniqueDiseases = new Set();
          this.trajData.forEach(item => {
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
        catagorizeData() {
            const cellTypeMap = new Map();
            const diseaseMap = new Map();
            const uniqueCellTypes = new Set();
            const uniqueDiseases = new Set();
            this.scatterData.forEach(item => {
                const cellType = item['Cell Type'];
                const disease = item['Disease Lesion'];
                const component1 = parseFloat(item['Component 1']); // 转换为数值类型
                const component2 = parseFloat(item['Component 2']); // 转换为数值类型
                uniqueCellTypes.add(cellType);
                uniqueDiseases.add(disease);
                if (!cellTypeMap.has(cellType)) {
                  cellTypeMap.set(cellType, []);
                }
                if (!diseaseMap.has(disease)) {
                  diseaseMap.set(disease, []);
                }
                cellTypeMap.get(cellType).push([component1, component2,cellType]);
                diseaseMap.get(disease).push([component1, component2,disease]);
              });
              this.cellScatterData = Array.from(cellTypeMap.values());
              this.diseaseScatterData = Array.from(diseaseMap.values());
              this.uniqueCellTypes = Array.from(uniqueCellTypes);
              this.uniqueDiseaseLesions = Array.from(uniqueDiseases);
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
                    text: 'Cellular proportion analysis',
                    subtext:'Boxplot of cellular proportion across lesions',
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
        initScatterCharts() {
          let option1={
            title: {
              text: 'Cell Clusters',
              left:'center'
            },
            grid: {
              left: '3%',
              right: '7%',
              bottom: '7%',
              containLabel: true
            },
            legend:{
              data:this.uniqueCellTypes,
              bottom:'bottom'
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
                          `Cell Type: ${extraInfo}<br/>` +
                          `Component1:${params.data[0]}<br/>`+
                          `Component2:${params.data[1]}<br/>`
                      );
                  } else {
                      return (
                          `Single Point: <br/>` +
                          `Cell Type: ${extraInfo}<br/>` +
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
            series: this.cellScatterData.map((data, index) => ({
                name: `Cell Type ${index}`,
                type: 'scatter',
                data: data.map(item => [...item.slice(0,2), `Cell Type ${item[2]}`])
            }))
          };
          let option2={
            title: {
              text: 'Disease Lesion',
              left:'center'
            },
            grid: {
              left: '3%',
              right: '7%',
              bottom: '7%',
              containLabel: true
            },
            legend:{
              data:this.uniqueDiseaseLesions,
              bottom:'bottom'
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
            series: this.diseaseScatterData.map((data, index) => {
                console.log(`Disease Lesion ${index} Data:`, data);
                return{name: `Disease Lesion ${index}`,
                type: 'scatter',
                data: data.map(item => [...item.slice(0,2), `Disease Lesion ${item[2]}`])
            }})
          };
          this.$nextTick(() =>{
              this.chart1 = this.initChart('chart1', option1);
              this.chart2 = this.initChart('chart2', option2);
          });
        },
        initColumnChart() {
            if(this.columnData && this.columnData.length>0){
                const option4 = this.createOption4();
                this.chart4 = this.initChart('chart4',option4);
            }
            else{
                console.error('Column data is not ready.');
            }
        },
        initTrajChart() {
          let option={
            title: {
              text: 'pseudo-tumorigenesis trajectory analysis',
              subtext: 'The putative pseudo-tumorigenesis trajectory',
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
              this.chart5 = this.initChart('chart5', option);
          });
        },
        initChart(refName, option) {
          let chart = echarts.init(this.$refs[refName]);
          chart.setOption(option);
          return chart;
        },
        disposeCharts() {
          if (this.chart1) this.chart1.dispose();
          if (this.chart2) this.chart2.dispose();
          //if (this.chart3) this.chart3.dispose();
          //if (this.chart4) this.chart3.dispose();
        }
    }
};
</script>

<style>
/* 可以添加一些样式 */
</style>