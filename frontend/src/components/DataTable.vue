<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-for="alignment in ['left', 'right']"
      :key="alignment"
      :class="alignment === 'left' ? 'justify-start' : 'justify-end'"
      class="flex gap-2 mb-2"
    >
      <label
        v-for="[ key, filter ] in Object.entries(filters).filter(([key , filter]) => ((alignment ==='right' && !filter.align) || filter.align === alignment))"
        :key="key"
      >
        <slot
          :key="key"
          :filter="filter"
          :name="`filters(${key})`"
          :rows="rowsInternal"
        >
          <!--  @todo Move to sub-component-->
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
              {{ option.label }}
            </option>
          </select>
        </slot>
      </label>

      <SearchField
        v-if="config.search && (alignment === 'right')"
        v-model="search"
      />
    </div>
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

        <svg
          v-if="fields[subRow] === sort.header"
          :class="sort.order === 'asc' ? '' : 'transform rotate-180'"
          class=""
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="12"
            x2="12"
            y1="19"
            y2="5"
          />
          <polyline points="5 12 12 5 19 12" />
        </svg>
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

        <Private :hide="fields[header].private === true">
          <slot
            :name="`field(${header})`"
            :row="row"
            :value=" fieldFormatValue(fields[header], row) "
          >
            {{ fieldFormatValue(fields[header], row) }}
          </slot>
        </Private>
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
import SearchField from '/@components/base/SearchField.vue'
import {
  CompareFn,
  FormatFn,
  getHandler,
  SortSettings,
  TableConfig,
  TableHeader,
  TableRow,
  ValueFn,
} from '/@components/DataTable'
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'


export default defineComponent({
  components : {SearchField},
  props      : {
    config: {
      type      : Object as TableConfig,
      required  : true,
      validator : (config) => {
        if (config.search
            && config.search.handler
            && typeof config.search.handler !== 'function') {
          return false
        }

        return true
      },
    },
    rows: {
      type     : Object as TableRow[],
      required : true,
    },
  },
  setup (props) {
    const sort : SortSettings = reactive({
      header : null,
      order  : 'desc',
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

    for (const [
      key, field
    ] of Object.entries(config.fields)) {
      if (!field.key) {
        field.key = key
      }

      field.format  = getHandler<FormatFn>(field, 'format')
      field.value   = getHandler<ValueFn>(field, 'value')
      field.compare = getHandler<CompareFn>(field, 'compare')
      //field.search = getHandler<CompareFn>(field, 'search')
    }

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


    function fieldFormatValue (header : TableHeader, row) {

      const fieldValue = header.value(row, header)
      return header.format(fieldValue, row)
    }

    const rowsInternal = computed(() => {
      let rows : TableRow[] = props.rows

      rows = rows.filter(row => {
        if (search.value !== '') {
          const result = config.search.handler(search.value, row)

          if (!result) {
            return false
          }
        }

        for (const [
          key, filter
        ] of Object.entries(config.filters)) {
          if (filter.value /* !== ''*/) {
            if (typeof filter.handler === 'function') {
              if (filter.handler(filter.value, row) === false) {
                return false
              }
            } else if (row[key] !== filter.value) {
              return false
            }
          }
        }
        return true
      })

      const sortHeader = sort.header as TableHeader
      if (sortHeader) {
        console.time(`${config.settings.translationPrefix} SORT`)
        rows.sort((a : TableRow, b : TableRow) => {
          const valueA = sortHeader.value(a, sortHeader)
          const valueB = sortHeader.value(b, sortHeader)

          const order = sort.order === 'asc' ? -1 : 1

          return order * sortHeader.compare(valueA, valueB)
        })
        console.timeEnd(`${config.settings.translationPrefix} SORT`)
      }

      return rows
    })

    function setSort (key : string) {
      const header = config.fields[key]

      if (sort.header !== null && sort.header.key === header.key) {
        sort.order = sort.order === 'asc' ? 'desc' : 'asc'
      } else {
        sort.header = header
        sort.order  = header.sort === 'asc' ? 'asc' : 'desc'
      }
    }

    return {
      ...toRefs(config),
      fieldFormatValue,
      columnCount,
      rowsInternal,
      setSort,
      sort,
      search,
    }
  },
})
</script>
