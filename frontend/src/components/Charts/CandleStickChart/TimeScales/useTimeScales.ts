import * as duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { SymbolDataResolution } from '@common/types/types';

export interface TimeScaleInterface {
  label: string;
  visible: duration.Duration;
  resolution: SymbolDataResolution;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimeScales = () => {
  const timeScales: TimeScaleInterface[] = [
    // {
    //     label: 'Hour',
    //     visible: dayjs.duration(1, 'hour'),
    //     resolution: 'minute',
    // },
    // {
    //   label: 'Today',
    //   visible: dayjs.duration(1, 'day'),
    //   resolution: '1minute',
    // },
    {
      label: 'Week',
      visible: dayjs.duration(7, 'day'),
      resolution: SymbolDataResolution.DAY,
    },
    {
      label: 'Month',
      visible: dayjs.duration(30, 'day'),
      resolution: SymbolDataResolution.DAY,
    },
    {
      label: '3 M',
      visible: dayjs.duration(3, 'month'),
      resolution: SymbolDataResolution.DAY,
    },
    {
      label: '1 Y',
      visible: dayjs.duration(1, 'year'),
      resolution: SymbolDataResolution.DAY,
    },
    {
      label: '3 Y',
      visible: dayjs.duration(3, 'year'),
      resolution: SymbolDataResolution.WEEK,
    },
    {
      label: '10 Y',
      visible: dayjs.duration(10, 'year'),
      resolution: SymbolDataResolution.WEEK,
    },
    {
      label: 'All Time',
      visible: dayjs.duration(1000, 'year'),
      resolution: SymbolDataResolution.WEEK,
    },
  ];

  const getScaleForRange = (min: dayjs.Dayjs, max: dayjs.Dayjs): TimeScaleInterface => {
    const delta = dayjs.duration(max.diff(min));

    const scale = timeScales.find(s => delta.asMilliseconds() < s.visible.asMilliseconds());

    if (!scale) {
      throw 'Invalid scale';
    }

    return scale;
  };

  const getScaleByLabel = (label: string): TimeScaleInterface => {
    const scale = timeScales.find(s => label === s.label);

    if (!scale) {
      throw `Invalid scale "${label}"`;
    }

    return timeScales.find(s => label === s.label);
  };

  return {
    getScaleByLabel,
    getScaleForRange,
    timeScales,
  };
};
