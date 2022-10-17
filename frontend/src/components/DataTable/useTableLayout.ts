import { Screens, useScreensize } from '@/hooks/useScreensize';
import { CurrencyUtils } from '@goplan-finance/utils';
import dayjs from 'dayjs';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { onBeforeMount, onBeforeUnmount } from 'vue';

export type TableLayout = string[] | string[][];

export interface TableLayoutCollection {
  [Screens.DEFAULT]?: TableLayout;
  [Screens.SM]?: TableLayout;
  [Screens.MD]?: TableLayout;
  [Screens.LG]?: TableLayout;
  [Screens.XL]?: TableLayout;
  [Screens.XL2]?: TableLayout;
}

export const useTableLayout = () => {
  const { breakpoint } = useScreensize();

  const findTableLayout = (tableLayouts: TableLayoutCollection) => {
    let currentScreenSizeFound = false;
    for (const screenSize of Object.values(Screens).reverse()) {
      if (screenSize === breakpoint.value) {
        currentScreenSizeFound = true;
        if (tableLayouts[breakpoint.value]) {
          return tableLayouts[breakpoint.value];
        }
      } else if (currentScreenSizeFound && tableLayouts[screenSize]) {
        return tableLayouts[screenSize];
      }
    }
    return tableLayouts[Screens.DEFAULT];
  };

  return {
    findTableLayout,
  };
};
