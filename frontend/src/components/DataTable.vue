<template>
  <div
    class="hidden lg:grid grid-cols-1 gap-2 px-4 py-2 text-gray-400 text-sm"
    :class="`lg:grid-cols-${columnCount}`"
  >
    <span
      v-for="(header, headerIndex) in config.headers"
      :key="headerIndex"
      class="grid items-center"
    >
      <a
        v-for="(item, itemIndex) in header"
        :key="itemIndex"
        class="cursor-pointer hover:text-gray-600 select-none"
        :class="{
          'lg:text-right': item.justify === 'right',
          'lg:text-center': item.justify === 'center'
        }"
        @click="setSort(item)"
      >{{ $t(config.settings.translationPrefix + '.' + item.key) }}</a>
    </span>
    <span v-if="config.settings?.actions" />
  </div>
  <div
    v-for="(row, rowIndex) in rows"
    :key="rowIndex"
    class="mb-2 grid grid-cols-2 sm:grid-cols-2 gap-2 bg-white rounded-lg px-4 py-3"
    :class="`lg:grid-cols-${columnCount}`"
  >
    <span
      v-for="(cell, cellIndex) in config.headers"
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
          {{ $t(config.settings.translationPrefix + '.' + header.key) }}
        </span>
        <template v-if="header.type === TableCellType.CUSTOM">
          <slot
            :name="header.key"
            :row="row"
          />
        </template>
        <template v-else>
          {{ row[header.key] }}
        </template>
      </span>
    </span>
    <span
      v-if="config.settings?.actions"
      class="grid items-center"
    >
      <slot
        name="actions"
        :row="rowIndex"
      />
    </span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive} from 'vue'

export enum TableCellType {
  STRING = 'string',
  NUMBER = 'number',
  CUSTOM = 'custom',
}

export interface TableHeader {
  key: string,
  type: TableCellType,
  classes?: string,
  justify?: 'left'|'right'|'center',
}

export type TableRow = Record<string, unknown>

export interface TableConfig {
  headers: TableHeader[][],
  rows: TableRow[]
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
    }
  },
  setup (props) {
    const sort: SortSettings = reactive({
      header : null,
      order  : true
    })

    const columnCount = computed(() => {
      const actions = props.config.settings.actions ? 1 : 0
      return props.config.headers.length + actions
    })

    const rows = computed(() => {
      const rows: unknown[]        = props.config.rows

      if (sort.header) {
        rows.sort((a: TableRow, b: TableRow) => {
          const valueA = a[sort.header.key]
          const valueB = b[sort.header.key]
          const order  = sort.order ? -1 : 1
          if (sort.header.type === TableCellType.STRING) {
            const textA = (valueA as string).toUpperCase()
            const textB = (valueB as string).toUpperCase()
            return (textA < textB) ? order : (textA > textB) ? (order * -1) : 0
          } else if (sort.header.type === TableCellType.NUMBER) {
            return (Number(valueA) < Number(valueB)) ? order : (order * -1)
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
      TableCellType,
      columnCount,
      rows,
      setSort
    }
  }
})
</script>
