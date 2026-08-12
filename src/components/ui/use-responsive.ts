import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/lib/breakpoints";

/** Tailwind-aligned breakpoints for style maps used by book.tsx etc. */
const SCREENS = {
  SM: BREAKPOINTS.SM,
  MD: BREAKPOINTS.MD,
  LG: BREAKPOINTS.LG,
  XL: BREAKPOINTS.XL,
};

export const useResponsive = (styles: any) => {
  const [responsiveStyles, setResponsiveStyles] = useState<any>(
    typeof styles === "object" ? styles.sm || styles.md || styles.lg || styles.xl : styles
  );

  useEffect(() => {
    const getResponsive = (nextStyles: any) => {
      let current;
      if (typeof nextStyles === "object") {
        if (nextStyles.sm && window.innerWidth >= SCREENS.SM) {
          current = nextStyles.sm;
        }
        if (nextStyles.md && window.innerWidth >= SCREENS.MD) {
          current = nextStyles.md;
        }
        if (nextStyles.lg && window.innerWidth >= SCREENS.LG) {
          current = nextStyles.lg;
        }
        if (nextStyles.xl && window.innerWidth >= SCREENS.XL) {
          current = nextStyles.xl;
        }
      } else {
        current = nextStyles;
      }
      return current;
    };

    const listener = () => {
      setResponsiveStyles(getResponsive(styles));
    };

    listener();
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [JSON.stringify(styles)]);

  return responsiveStyles;
};
