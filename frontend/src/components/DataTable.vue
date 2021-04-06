<template>
  <div
    :class="`lg:grid-cols-${columnCount}`"
    class="hidden lg:grid grid-cols-1 gap-2 px-4 py-2 text-gray-400 text-sm"
  >
    <span
      v-for="(row, rowIndex) in headers"
      :key="rowIndex"
      class="grid items-center"
    >
      <span
        v-for="(item, itemIndex) in row"
        :key="itemIndex"
        class="cursor-pointer hover:text-gray-600 select-none"
        :class="{
          'lg:text-right': item.justify === 'right',
          'lg:text-center': item.justify === 'center'
        }"
        @click="setSort(item)"
      >
        {{ $t(settings.translationPrefix + '.' + item.key) }}
      </span>
    </span>
    <span v-if="settings?.actions" />
  </div>
  <div
    v-for="(row, rowIndex) in rowsInternal"
    :key="rowIndex"
    :class="`lg:grid-cols-${columnCount}`"
    class="mb-2 grid grid-cols-2 sm:grid-cols-2 gap-2 bg-white rounded-lg px-4 py-3"
  >
    <span
      v-for="(cell, cellIndex) in headers"
      :key="cellIndex"
      class="grid grid-cols-none sm:grid-cols-2 lg:grid-cols-1 gap-1 items-center"
    >
      <span
        v-for="(header, headerIndex) in cell"
        :key="headerIndex"
        :class="[
          header.classes,
          {
            'lg:text-right': header.justify === 'right',
            'lg:text-center': header.justify === 'center'
          }
        ]"
      >
        <span
          class="block lg:hidden text-sm font-light text-gray-500"
        >
          {{ $t(settings.translationPrefix + '.' + header.key) }}
        </span>
        <slot
          :name="header.key"
          :row="row[header.key]"
        >
          {{ formatValue(row[header.key]) }}
        </slot>
      </span>
    </span>
    <span
      v-if="settings?.actions"
      class="grid items-center"
    >
      <slot
        :row="rowIndex"
        name="actions"
      />
    </span>
  </div>
</template>

<script lang="ts">
import {Money} from 'ts-money'
import {computed, defineComponent, reactive, toRefs} from 'vue'

export type TableRow = Record<string, unknown>

export interface TableHeader {
  key?: string,
  classes?: string,
  justify?: 'left' | 'right' | 'center',
  sortKey?: string
}

export interface TableConfig {
  headers: TableHeader[][],
  settings?: {
    actions: boolean,
    translationPrefix: string
  },
}

interface SortSettings {
  header: TableHeader,
  order: boolean
}

export default defineComponent({
  props: {
    config: {
      type     : Object as TableConfig,
      required : true
    },
    rows: {
      type     : Object as TableRow[],
      required : true
    }
  },
  setup (props) {
    const sort: SortSettings = reactive({
      header : null,
      order  : true
    })

    const columnCount = computed(() => {
      const actions = props.config.settings.actions ? 1 : 0
      return Object.keys(props.config.headers).length + actions
    })

    const config: TableConfig = reactive({
      headers  : [],
      settings : props.config.settings,
    })


    for (const [
      key, header
    ] of Object.entries(props.config.headers)) {
      let headerArr = header
      if (!Array.isArray(header)) {
        header.key = key
        headerArr  = [
          header
        ]
      }

      config.headers.push(headerArr)
    }

    function formatValue (value) {
      if (value instanceof Money) {
        return `${value.toDecimal().toFixed(2)} ${value.getCurrencyInfo().symbol}`
      } else if (!isNaN(Number(value))) {
        return Number(value).toFixed(2)
      }
      return value
    }

    const rowsInternal = computed(() => {
      const rows: TableRow[] = props.rows

      if (sort.header) {
        rows.sort((a: TableRow, b: TableRow) => {
          let valueA  = a[sort.header.key]
          let valueB  = b[sort.header.key]
          const order = sort.order ? -1 : 1

          if (sort.header.sortKey) {
            valueA = valueA[sort.header.sortKey]
            valueB = valueB[sort.header.sortKey]
          }

          if (valueA instanceof Money && valueB instanceof Money) {
            return (valueA.toDecimal() < valueB.toDecimal()) ? order : (order * -1)
          } else if (valueA instanceof String) {
            const textA = (valueA as string).toUpperCase()
            const textB = (valueB as string).toUpperCase()
            return (textA < textB) ? order : (textA > textB) ? (order * -1) : 0
          } else {
            return (valueA < valueB) ? order : (order * -1)
          }
        })
      }

      return rows
    })

    function setSort (header: TableHeader) {
      if (sort.header !== null && sort.header.key === header.key) {
        sort.order = !sort.order
      } else {
        sort.header   = header
      }
    }

    return {
      ...toRefs(config),
      formatValue,
      columnCount,
      rowsInternal,
      setSort
    }
  }
})
</script>
