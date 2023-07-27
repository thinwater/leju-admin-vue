<template>
  <div class="order-main">
    <div id="order" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import { getOrderData } from './order.js'
export default {
  name: 'OrderBar',
  mixins: [],
  data() {
    return {
      msg: 'hello world'
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
    const orderEchart = echarts.init(document.getElementById('order'))
    const mockData = getOrderData()
    const date = mockData.map(item => item.date)
    // console.log('date ===>', date)
    const option = {
      title: {
        text: '订单退单柱状图',
        textStyle: {
          fontSize: 16,
          color: '#9aa8d4'
        }
      },
      legend: {
        bottom: 10
      },
      tooltip: {
        backgroundColor: 'rgba(50,50,50,0.7)',
        textStyle: {
          color: '#fff'
        },
        // formatter: '{a}<br />{b}: {c}',
        formatter: function(params, ticket, callback) {
          return params.seriesName + '<br />' + params.marker + params.name + ':' + params.value
        },
        borderWidth: 0
      },
      xAxis: {
        type: 'category',
        data: date,
        axisLabel: {
          rotate: 90
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#797e8b',
            width: 1
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#7c818f',
            width: 1
          }
        },
        axisLabel: {
          color: '#7c818f',
          fontSize: 12
        }
      },
      series: [
        {
          name: '订单',
          data: mockData.map(item => item.order),
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#7e05e2' // 0% 处的颜色
                },
                {
                  offset: 0.5, color: '#b600fd' // 50% 处的颜色
                },
                {
                  offset: 1, color: '#b904e0' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          animationEasing: 'elasticOut'
        },
        {
          name: '退单',
          data: mockData.map(item => item.returnOrder),
          type: 'bar',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, color: '#24c9ff' // 0% 处的颜色
                },
                {
                  offset: 0.5, color: '#24a3ff' // 50% 处的颜色
                },
                {
                  offset: 1, color: '#228bf3' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          animationEasing: 'elasticOut'
        }
      ]
      //   animationDelay: function (idx) {
      //     // 越往后的数据延迟越大
      //     return idx * 50;
      // }
    }
    orderEchart.setOption(option)
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.order-main{
  width: 100%;
  height: 100%;
  #order{
    width: 100%;
    height: 100%;
  }
}

</style>
