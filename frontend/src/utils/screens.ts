export enum Screen {
 SM = 'sm',
 MD = 'md',
 LG = 'lg',
 XL = 'xl',
 XL2 = '2xl',
}

// @todo: import this from tailwind config
const screens = {
  'sm'  : '640px',
  'md'  : '768px',
  'lg'  : '1024px',
  'xl'  : '1280px',
  '2xl' : '1536px',
}

const getBreakpointValue = (value: string): number => {
  return parseInt(screens[value].replace('px', ''), 10)
}

export const getCurrentBreakpoint = (innerWidth: number): string => {
  let currentBreakpoint: string = null
  let biggestBreakpointValue    = 0
  for (const breakpoint of Object.keys(screens)) {
    const breakpointValue = getBreakpointValue(breakpoint)
    console.log(breakpointValue, innerWidth, biggestBreakpointValue)
    if (
      breakpointValue > biggestBreakpointValue &&
      innerWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue
      currentBreakpoint      = breakpoint
    }
  }
  return currentBreakpoint
}
