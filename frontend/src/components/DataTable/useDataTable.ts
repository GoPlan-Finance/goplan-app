import { Screens } from '@/hooks/useScreensize';
import { CurrencyUtils } from '@goplan-finance/utils';
import dayjs from 'dayjs';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { TableLayoutCollection } from '@components/DataTable/useTableLayout';

/* eslint-disable no-use-before-define */

export type CompareFn = (a: unknown, b: unknown) => number;
export type FormatFn = (value: unknown, row: unknown) => void;
export type ValueFn = (row: unknown, header: TableHeader) => unknown;
export type SearchFn = (searchString: string, value: unknown) => boolean;

export interface TableHeader {
  key?: string;
  sort?: 'asc' | 'desc';
  classes?: string;
  justify?: 'left' | 'right' | 'center';
  private?: boolean;
  format?: keyof FormatTypes | FormatFn;
  compare?: keyof FormatTypes | CompareFn;
  value?: ValueFn;
  width?: string;
}

export type TableRow = Record<string, unknown>;

interface FormatterInterface {
  format?: FormatFn;
  compare?: CompareFn;
  value?: ValueFn;
  //  search? : SearchFn
}

export type FormatTypes = {
  date: FormatterInterface;
  datetime: FormatterInterface;
  time: FormatterInterface;
  currency: FormatterInterface;
  money: FormatterInterface;
  percent: FormatterInterface;
  range: FormatterInterface;
  ___default___: FormatterInterface;
};

export interface Filter {
  align: string;
  value: CallableFunction;
  options: FilterOption[];
  handler: CallableFunction;
}

export interface FilterOption {
  value: string;
  label: string;
}

export type Filters = Record<string, Filter>;

export interface TableConfig {
  fields: Record<string, TableHeader>;
  tableLayoutCollection: TableLayoutCollection;
  settings?: {
    actions: boolean;
    translationPrefix: string;
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    locale?: string;
  };
  filters?: Filters;
  search?: {
    handler: SearchFn;
  };
}

export interface SortSettings {
  header: TableHeader;
  order: 'asc' | 'desc';
}

export interface RangeValue {
  from: number;
  to: number;
  currency?: string;
}

export const useDataTable = (locale?: string) => {
  const { formatCurrency, formatPercent } = useNumberFormat();
  function dateFormat(format) {
    return {
      format: (value: Date) => dayjs(value).format(format),
      compare: (a: Date, b: Date) => b.getTime() - a.getTime(),
    };
  }

  function currencyFormat(fixedDecimals) {
    return {
      format: (value: number, row: unknown) => formatCurrency(value, row['currency']),
      compare: (a, b) => {
        // @todo add currency conversions
        return b - a;
      },
    };
  }

  const formatters: FormatTypes = {
    date: dateFormat('YYYY-MM-DD'),
    datetime: dateFormat('YYYY-MM-DD HH:mm:ss'),
    time: dateFormat('HH:mm:ss'),

    currency: currencyFormat(true),
    money: currencyFormat(false),

    percent: {
      format: (value: number) => formatPercent(value),
    },

    range: {
      compare: (a: RangeValue, b: RangeValue): number => {
        if (!a) {
          return 1;
        }
        if (!b) {
          return -1;
        }

        return b.to - b.from - (a.to - a.from);
      },
    },

    ___default___: {
      value: (row: unknown, header: TableHeader) => row[header.key],
      format: value => value,
      compare: (valueA, valueB): number => {
        // if (valueA instanceof Money && valueB instanceof Money) {
        //   return valueB.toDecimal() - valueA.toDecimal()
        // }

        if (typeof valueA === 'string' || typeof valueB === 'string') {
          const textA = valueA ? String(valueA).toUpperCase() : '';
          const textB = valueB ? String(valueB).toUpperCase() : '';
          return textA.localeCompare(textB);
        }

        return Number(valueB) - Number(valueA);
      },
    },
  };

  function getHandler<T>(field: TableHeader, op: keyof FormatterInterface): T {
    const formatHandler = (handler, op) => {
      const formatType: FormatterInterface = formatters[handler];

      if (formatType && formatType[op]) {
        return formatType[op] as unknown as T;
      }
      return null;
    };

    if (typeof field[op] === 'function') {
      return field[op] as unknown as T;
    }

    const format = field['format'];
    if (typeof format === 'string') {
      const handler = formatHandler(format, op);
      if (handler) {
        return handler;
      }
    }

    const handler = formatHandler('___default___', op);
    if (handler) {
      return handler;
    }

    throw `Unknown table data "${op}" for "${handler}"`;
  }

  return {
    getHandler,
  };
};
