import { useUserStore } from '@/store';

export const useNumberFormat = () => {
  const userStore = useUserStore();
  userStore.loadUser();

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    if (!value) {
      return '';
    }
    if (!isNaN(Number(value))) {
      value = Number(value);
    }

    return new Intl.NumberFormat(userStore.state.user?.locale, options).format(value);
  };

  const formatCurrency = (
    value: number,
    currency?: string,
    options?: Intl.NumberFormatOptions
  ): string => {
    const currencyOptions: Intl.NumberFormatOptions = {
      ...options,
      currency: currency ?? userStore.state?.user?.defaultCurrency,
      style: 'currency',
    };

    return formatNumber(value, currencyOptions);
  };

  /**
   * Format a percent value, given as a value between 0 and 1 (eg. 0.84 for 84%)
   *
   * @param value
   * @param options
   */
  const formatPercent = (value: number, options?: Intl.NumberFormatOptions) => {
    return `${formatNumber(value * 100, {
      ...options,
      maximumFractionDigits: options?.maximumFractionDigits ?? 1,
    })} %`;
  };

  return {
    formatNumber,
    formatCurrency,
    formatPercent,
  };
};
