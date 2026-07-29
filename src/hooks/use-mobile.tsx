import * as React from "react"
import { BREAKPOINTS } from "@/lib/breakpoints"

/** Re-export aligned with Tailwind `md` (768). Prefer `@/hooks/useIsMobile` in app code. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MD - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MD)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.MD)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
