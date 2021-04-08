<template>
  <apexchart
    :options="chartOptions"
    :series="series"
    height="350"
    type="bar"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'


export default defineComponent({
  setup () {
    const data = reactive({
      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },
        xaxis: {
          categories: [
            1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998,
          ],
        },
      },
      series: [
        {
          name : 'series-1',
          data : [
            30, 40, 35, 50, 49, 60, 70, 91,
          ],
        },
      ],
    })

    return {
      ...toRefs(data),
    }
  },
})

</script>
