<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name:'DocPage',  
  data() {
  return {
    searchQuery: ''
  };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      const rawData = [
        [100, 302, 301, 334, 390, 330, 320],
        [320, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 212, 201, 154, 190, 330, 410],
        [820, 832, 901, 934, 1290, 1330, 1320]
      ];

      const totalData = [];
      for (let i = 0; i < rawData[0].length; ++i) {
        let sum = rawData.reduce((acc, cur) => acc + cur[i], 0);
        totalData.push(sum);
      }

      const grid = {
        left: 100,
        right: 100,
        top: 50,
        bottom: 50
      };

      const series = [
        'Direct',
        'Mail Ad',
        'Affiliate Ad',
        'Video Ad',
        'Search Engine'
      ].map((name, sid) => {
        return {
          name,
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          label: {
            show: true,
            formatter: (params) => {
              const percentage = Math.min(100, (params.value / totalData[params.dataIndex]) * 100);
              return `${percentage.toFixed(2)}%`;
            }
          },
          data: rawData[sid].map((d, did) => d/totalData[did])
        };
      });

      const option = {
        legend: {
          selectedMode: false,
          data: series.map((s) => s.name)
        },
        grid,
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series
      };

      const myChart = echarts.init(this.$refs.chart);
      myChart.setOption(option);
    }
  }
};
</script>

<style>
/* 可以添加一些样式 */
</style>