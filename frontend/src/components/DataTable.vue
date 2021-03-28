<template>
  <div class="hidden lg:grid grid-cols-1 lg:grid-cols-8 gap-2 px-4 py-4 text-gray-400 text-sm">
    <span
      v-for="(row, rowIndex) in config.headers"
      :key="rowIndex"
      class="grid items-center"
    >
      <span
        v-for="(item, itemIndex) in row"
        :key="itemIndex"
        :class="{
          'lg:text-right': item.justify === 'right',
          'lg:text-center': item.justify === 'center'
        }"
      >{{ item.label }}</span>
    </span>
    <span />
  </div>
  <div
    v-for="(row, rowIndex) in config.rows"
    :key="rowIndex"
    class="mb-2 grid grid-cols-1 lg:grid-cols-8 gap-2 bg-white rounded-lg px-4 py-4 whitespace-nowrap"
  >
    <span
      v-for="(cell, cellIndex) in row"
      :key="cellIndex"
      class="grid grid-cols-none sm:grid-cols-2 lg:grid-cols-1 gap-1 items-center"
    >
      <span
        v-for="(item, itemIndex) in cell"
        :key="itemIndex"
        :class="[
          config.headers[cellIndex][itemIndex]?.classes,
          {
            'lg:text-right': config.headers[cellIndex][itemIndex]?.justify === 'right',
            'lg:text-center': config.headers[cellIndex][itemIndex]?.justify === 'center'
          }
        ]"
      >
        <span
          class="block lg:hidden text-sm font-light text-gray-500"
        >
          {{ config.headers[cellIndex][itemIndex]?.label }}
        </span>
        <template v-if="config.headers[cellIndex][itemIndex]?.type === TableCellType.IMAGE">
          <img
            :src="item"
          >
        </template>
        <template v-else>
          {{ item }}
        </template>
      </span>
    </span>
    <span
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
import {defineComponent} from 'vue'

export enum TableCellType {
  STRING = 'string',
  IMAGE = 'image'
}

export interface TableHeader {
  label?: string,
  classes?: string,
  justify?: 'left'|'right'|'center',
  type?: TableCellType
}

export interface TableConfig {
  headers: TableHeader[][],
  rows: string[][][]
}

export default defineComponent({
  props: {
    config: {
      type     : Object as TableConfig,
      required : true
    }
  },
  setup (props) {
    return {
      TableCellType
    }
  }
})
</script>
