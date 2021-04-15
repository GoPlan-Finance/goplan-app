import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

const getBreakpointValue = (value: string): number => {
  return parseInt(fullConfig.theme.screens[value].replace('px', ''), 10)
}

export const getCurrentBreakpoint = (): string => {
  let currentBreakpoint: string
  let biggestBreakpointValue = 0
  for (const breakpoint of Object.keys(fullConfig.theme.screens)) {
    const breakpointValue = getBreakpointValue(breakpoint)
    if (
      breakpointValue > biggestBreakpointValue &&
      window.innerWidth >= breakpointValue
    ) {
      biggestBreakpointValue = breakpointValue
      currentBreakpoint      = breakpoint
    }
  }
  return currentBreakpoint
}
