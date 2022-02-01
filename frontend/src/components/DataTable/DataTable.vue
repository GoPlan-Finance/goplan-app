<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-for="alignment in ['left', 'right']"
      :key="alignment"
      :class="alignment === 'left' ? 'justify-start' : 'justify-end'"
      class="flex gap-2 mb-2"
    >
      <slot v-if="alignment === 'right'" :name="`beforeFilters(${alignment})`" />
      <template v-for="(filter, key) in filters" :key="key">
        <label v-if="(alignment === 'right' && !filter.align) || filter.align === alignment">
          <slot :key="key" :filter="filter" :name="`filters(${key})`" :rows="rowsInternal">
            <!--  @todo Move to sub-component-->
            <select v-model="filter.value" class="rounded-lg border-0" name="type">
              <option v-for="option in filter.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </slot>
        </label>
      </template>
      <SearchField
        v-if="search && alignment === 'right'"
        v-model:value="searchString"
        input-class="border-0"
      />
      <slot v-if="alignment === 'right'" :name="`afterFilters(${alignment})`" />
    </div>
  </div>
  <div class="grid gap-2 px-4 py-2 text-gray-400 text-sm" :style="tableTemplate">
    <div v-for="(row, rowIndex) in currentTableLayout" :key="rowIndex" class="grid items-center">
      <div
        v-for="(subRow, subRowIndex) in row"
        :key="subRowIndex"
        :class="{
          'flex-row-reverse': fields[subRow].justify === 'right',
          'text-center justify-center': fields[subRow].justify === 'center',
        }"
        class="flex cursor-pointer hover:text-gray-600 select-none whitespace-nowrap overflow-hidden overflow-ellipsis"
        @click="setSort(subRow)"
      >
        {{ t(settings.translationPrefix + '.' + subRow) }}
        <ChevronDownIcon
          v-if="fields[subRow] === sort.header"
          :class="sort.order === 'asc' ? '' : 'transform rotate-180'"
          class="w-5 h-5"
        />
      </div>
    </div>
    <div v-if="settings?.actions" />
  </div>
  <div
    v-for="(row, rowIndex) in rowsInternal"
    :key="rowIndex"
    :style="tableTemplate"
    class="mb-2 grid gap-2 bg-white rounded-lg px-4 py-3"
  >
    <div
      v-for="(cell, cellIndex) in currentTableLayout"
      :key="cellIndex"
      class="grid grid-cols-none gap-1 items-center"
    >
      <div
        v-for="(header, headerIndex) in cell"
        :key="headerIndex"
        :class="[
          fields[header].classes,
          {
            'text-right justify-end': fields[header].justify === 'right',
            'text-center justify-center': fields[header].justify === 'center',
          },
        ]"
        class="whitespace-nowrap overflow-hidden overflow-ellipsis flex"
      >
        <Private :hide="fields[header].private === true">
          <slot
            :name="`field(${header})`"
            :row="row"
            :value="fieldFormatValue(fields[header], row)"
          >
            {{ fieldFormatValue(fields[header], row) }}
          </slot>
        </Private>
      </div>
    </div>
    <div v-if="settings?.actions" class="flex justify-end gap-2 items-center">
      <slot :row="row" name="actions" />
    </div>
  </div>
  <div :style="tableTemplate" class="mb-2 grid gap-2 px-4 py-3">
    <div
      v-for="(cell, cellIndex) in currentTableLayout"
      :key="cellIndex"
      class="grid grid-cols-none gap-1 items-center"
    >
      <div
        v-for="(header, headerIndex) in cell"
        :key="headerIndex"
        :class="[
          fields[header].classes,
          {
            'text-right justify-end': fields[header].justify === 'right',
            'text-center justify-center': fields[header].justify === 'center',
          },
        ]"
      >
        <Private :hide="fields[header].private === true">
          <slot :name="`summary(${header})`" />
        </Private>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchField from '@components/base/SearchField.vue';
import {
  CompareFn,
  FormatFn,
  SortSettings,
  TableConfig,
  TableHeader,
  TableRow,
  useDataTable,
  ValueFn,
} from '@components/DataTable/useDataTable';
import { computed, reactive, ref, toRefs } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/outline';
import { TableLayout, useTableLayout } from '@components/DataTable/useTableLayout';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  config: TableConfig;
  rows: TableRow[];
}>();

const { filters, settings, fields, search, tableLayoutCollection } = toRefs(props.config);
const { getHandler } = useDataTable(settings.value.locale);
const { findTableLayout } = useTableLayout();
const { t } = useI18n();

const sort: SortSettings = reactive({
  header: null,
  order: 'desc',
});

const searchString = ref('');

function fieldFormatValue(header: TableHeader, row): string {
  const value = header.value(row, header);
  return header?.format(value, row);
}

function setSort(key: string, direction: 'asc' | 'desc' = null) {
  const header = fields.value[key];

  if (sort.header !== null && sort.header.key === header.key) {
    sort.order = sort.order === 'asc' ? 'desc' : 'asc'; // reverse
  } else {
    sort.header = header;

    if (!direction) {
      direction = header.sort === 'asc' ? 'asc' : 'desc';
    }

    sort.order = direction;
  }
}

const objectToNestedArrays = (object: Record<any, any>) =>
  object.map(key => {
    if (!Array.isArray(key)) {
      return [key];
    }
    return key;
  });

const currentTableLayout = computed<string[][]>(() => {
  const tableLayout = findTableLayout(tableLayoutCollection.value);

  const arr = objectToNestedArrays(tableLayout);

  arr.forEach(layout =>
    layout.map(fieldName => {
      if (!fields.value[fieldName] || typeof fields.value[fieldName] !== 'object') {
        throw `The field "${fieldName}" is present in "headerLayout", but missing in "  fields"`;
      }
    })
  );

  return arr;
});

for (const [key, field] of Object.entries(fields.value)) {
  if (!field.key) {
    field.key = key;
  }

  field.value = getHandler<ValueFn>(field, 'value');
  field.compare = getHandler<CompareFn>(field, 'compare');
  //field.search = getHandler<CompareFn>(field, 'search')

  field.format = getHandler<FormatFn>(field, 'format');
}

if (settings.value.sort) {
  if (!Object.values(fields.value).find(field => field.key === settings.value.sort.field)) {
    throw `Sort field ${props.config.settings.sort.field} doesnt exists in "fields"`;
  }

  setSort(settings.value.sort.field, settings.value.sort.direction);
}

const tableTemplate = computed(() => {
  let template = '';
  let width = '';
  for (const column of currentTableLayout.value) {
    for (const field of column) {
      width = fields.value[field]?.width;
    }
    template += width ?? '1fr';
    template += ' ';
    width = '';
  }
  if (settings.value.actions) {
    template += '56px'; // This is enough space for 2 actions, eventually we will have to come up with a better way to display this
  }
  return `grid-template-columns: ${template};`;
});

const rowsInternal = computed(() => {
  const rows = props.rows.filter(row => {
    if (searchString.value !== '') {
      const result = search.value.handler(searchString.value, row);

      if (!result) {
        return false;
      }
    }

    if (filters) {
      for (const [key, filter] of Object.entries(filters.value)) {
        if (filter?.value && filter?.handler) {
          if (typeof filter.handler === 'function') {
            if (filter.handler(filter.value, row) === false) {
              return false;
            }
          } else if (row[key] !== filter.value) {
            return false;
          }
        }
      }
    }
    return true;
  });

  if (sort.header) {
    console.time(`${settings.value.translationPrefix} SORT`);
    rows.sort((a: TableRow, b: TableRow) => {
      const valueA = sort.header.value(a, sort.header);
      const valueB = sort.header.value(b, sort.header);

      const order = sort.order === 'asc' ? -1 : 1;

      return order * sort.header.compare(valueA, valueB);
    });
    console.timeEnd(`${settings.value.translationPrefix} SORT`);
  }

  return rows;
});
</script>
