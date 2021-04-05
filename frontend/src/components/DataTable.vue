<template>
  <div
    class="hidden lg:grid grid-cols-1 gap-2 px-4 py-2 text-gray-400 text-sm"
    :class="`lg:grid-cols-${columnCount}`"
  >
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
      >{{ $t(config.settings.translationPrefix + '.' + item.key) }}</span>
    </span>
    <span v-if="config.settings?.actions" />
  </div>
  <div
    v-for="(row, rowIndex) in config.rows"
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
        <template v-if="header.type === TableCellType.IMAGE">
          <img
            :src="row[header.key]"
          >
        </template>
        <template v-if="header.type === TableCellType.CUSTOM">
          <slot
            :name="header.key"
            :row="row[header.key]"
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
import {defineComponent, computed} from 'vue'

export enum TableCellType {
  STRING = 'string',
  IMAGE = 'image',
  CUSTOM = 'custom',
}

export interface TableHeader {
  key?: string,
  classes?: string,
  justify?: 'left'|'right'|'center',
  type?: TableCellType,
}

export interface TableConfig {
  headers: TableHeader[][],
  rows: Record<string, any>[]
  settings?: {
    actions: boolean,
    translationPrefix: string
  },
}

export default defineComponent({
  props: {
    config: {
      type     : Object as TableConfig,
      required : true
    }
  },
  setup (props) {
    const columnCount = computed(() => {
      const actions = props.config.settings.actions ? 1 : 0
      return props.config.headers.length + actions
    })

    return {
      TableCellType,
      columnCount
    }
  }
})
</script>
