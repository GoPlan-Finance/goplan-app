import { onBeforeMount, onBeforeUnmount, ref } from 'vue';

export enum Screens {
  DEFAULT = 'default',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XL2 = '2xl',
}

// @todo: import this from tailwind config
const screens = {
  [Screens.SM]: '640px',
  [Screens.MD]: '768px',
  [Screens.LG]: '1024px',
  [Screens.XL]: '1280px',
  [Screens.XL2]: '1536px',
};

export const useScreensize = () => {
  const breakpoint = ref<Screens>(Screens.DEFAULT);

  const getBreakpointValue = (value: string): number => {
    return parseInt(screens[value].replace('px', ''), 10);
  };

  const getCurrentBreakpoint = (innerWidth: number): Screens => {
    let currentBreakpoint: string = null;
    let biggestBreakpointValue = 0;
    for (const breakpoint of Object.keys(screens)) {
      const breakpointValue = getBreakpointValue(breakpoint);
      if (breakpointValue > biggestBreakpointValue && innerWidth >= breakpointValue) {
        biggestBreakpointValue = breakpointValue;
        currentBreakpoint = breakpoint;
      }
    }
    return currentBreakpoint as Screens;
  };

  const resizeHandler = event => {
    breakpoint.value = getCurrentBreakpoint(event.target.innerWidth);
  };

  onBeforeMount(async () => {
    breakpoint.value = getCurrentBreakpoint(window.innerWidth);
    window.addEventListener('resize', resizeHandler, { passive: true });
  });

  onBeforeUnmount(async () => {
    window.removeEventListener('resize', resizeHandler);
  });

  return { breakpoint };
};
