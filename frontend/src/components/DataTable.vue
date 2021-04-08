<template>
  <div class="flex justify-end gap-2 mb-2">
    <SearchField
      v-if="config.search"
      v-model="search"
    />
    <label
      v-for="filter in filters"
      :key="filter"
    >
      <select
        v-model="filter.value"
        class="rounded-lg border-0"
        name="type"
      >
        <option
          v-for="option in filter.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.display }}
        </option>
      </select>
    </label>
  </div>

  <div
    :class="`lg:grid-cols-${columnCount}`"
    class="hidden lg:grid grid-cols-1 gap-2 px-4 py-2 text-gray-400 text-sm"
  >
    <div
      v-for="(row, rowIndex) in headerLayout"
      :key="rowIndex"
      class="grid items-center"
    >
      <div
        v-for="(subRow, subRowIndex) in row"
        :key="subRowIndex"
        :class="{
          'lg:text-right': fields[subRow].justify === 'right',
          'lg:text-center': fields[subRow].justify === 'center'
        }"
        class="cursor-pointer hover:text-gray-600 select-none"
        @click="setSort(subRow)"
      >
        {{ $t(settings.translationPrefix + '.' + subRow) }}
      </div>
    </div>
    <div v-if="settings?.actions" />
  </div>
  <div
    v-for="(row, rowIndex) in rowsInternal"
    :key="rowIndex"
    :class="`lg:grid-cols-${columnCount}`"
    class="mb-2 grid grid-cols-2 sm:grid-cols-2 gap-2 bg-white rounded-lg px-4 py-3"
  >
    <div
      v-for="(cell, cellIndex) in headerLayout"
      :key="cellIndex"
      class="grid grid-cols-none sm:grid-cols-2 lg:grid-cols-1 gap-1 items-center"
    >
      <div
        v-for="(header, headerIndex) in cell"
        :key="headerIndex"
        :class="[
          header.classes,
          {
            'lg:text-right': fields[header].justify === 'right',
            'lg:text-center': fields[header].justify === 'center'
          }
        ]"
      >
        <div
          class="block lg:hidden text-sm font-light text-gray-500 cursor-pointer hover:text-blue-600 select-none"
          @click="setSort(header)"
        >
          {{ $t(settings.translationPrefix + '.' + header) }}
        </div>
        <slot
          :name="header"
          :row="row"
          :value="row[header]"
        >
          {{ formatValue(fields[header], { value: row[header], row }) }}
        </slot>
      </div>
    </div>
    <div
      v-if="settings?.actions"
      class="grid items-center"
    >
      <slot
        :row="rowIndex"
        name="actions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import * as dayjs from 'dayjs'
import { Money } from 'ts-money'
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import SearchField from '../components/base/SearchField.vue'


export type TableRow = Record<string, unknown>

type FormatFn = (row : unknown, value : unknown) => void
type SearchFn = (value : unknown, searchString : string) => void


export interface TableHeader {
  key? : string,
  classes? : string,
  justify? : 'left' | 'right' | 'center',
  sortKey? : string
  format? : 'date' | 'datetime' | 'time' | FormatFn
}


export interface TableConfig {
  fields : TableHeader[][],
  headerLayout : string[] | string[][],
  settings? : {
    actions : boolean,
    translationPrefix : string
  },
  filters : Record<string, any>,
  search : {
    function : SearchFn
  }
}


interface SortSettings {
  header : TableHeader,
  order : boolean
}


export default defineComponent({
  components : {SearchField},
  props      : {
    config: {
      type     : Object as TableConfig,
      required : true,
    },
    rows: {
      type     : Object as TableRow[],
      required : true,
    },
  },
  setup (props) {
    const sort : SortSettings = reactive({
      header : null,
      order  : true,
    })

    const columnCount = computed(() => {
      const actions = props.config.settings.actions ? 1 : 0
      return Object.keys(props.config.headerLayout).length + actions
    })

    const config : TableConfig = reactive({
      fields       : props.config.fields,
      headerLayout : [],
      settings     : props.config.settings || {},
      filters      : props.config.filters || {},
      search       : props.config.search || {},
    })

    const search = ref('')

    config.headerLayout = props.config.headerLayout.map(key => {
      if (!Array.isArray(key)) {
        return [
          key,
        ]
      }
      return key
    })

    config.headerLayout.forEach(layout => layout.map(fieldName => {
      if (typeof config.fields[fieldName] !== 'object') {
        throw `The field ${fieldName} is present in "headerLayout", but missing in "  fields"`
      }
    }))

    function formatValue (header : TableHeader, {value, row}) {

      if (!header.format) {
        return value
      }

      if (typeof header.format === 'function') {
        return header.format(value, row)
      }

      if (header.format === 'date') {
        return dayjs(value).format('YYYY-MM-DD')
      }

      if (header.format === 'datetime') {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }

      if (header.format === 'time') {
        return dayjs(value).format('HH:mm:ss')
      }

      throw `Unknown table dataformatter "${header.format}`
    }

    const rowsInternal = computed(() => {
      let rows : TableRow[] = props.rows

      rows = rows.filter(row => {
        if (search.value !== '') {
          const result = config.search.function(row, search.value)
          if (!result) {
            return false
          }
        }

        for (const [
          key, filter
        ] of Object.entries(config.filters)) {
          if (filter.value !== '') {
            if (row[key] !== filter.value) {
              return false
            }
          }
        }
        return true
      })

      if (sort.header) {
        rows.sort((a : TableRow, b : TableRow) => {
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

    function setSort (key : string) {
      const header = config.fields[key]
      if (sort.header !== null && sort.header.key === header.key) {
        sort.order = !sort.order
      } else {
        sort.header = header
      }
    }

    return {
      ...toRefs(config),
      formatValue,
      columnCount,
      rowsInternal,
      setSort,
      sort,
      search,
    }
  },
})
</script>
