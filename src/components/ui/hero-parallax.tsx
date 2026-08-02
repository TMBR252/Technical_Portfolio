"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type HeroProduct = {
  title: string;
  href: string;
  thumbnail: string;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const SCROLL_CUBE_INDICES = [0, 1, 2, 3, 4, 5];

/**
 * Un-pinned hero. The stage is one frame tall and simply scrolls away; the
 * title drift / collage reveal are driven by the stage's own position in the
 * viewport, so it behaves identically whether the scroller is the window or
 * the Marvin page shell.
 */
export const HeroParallax = ({
  products,
  isLowPowerMode,
}: {
  products: HeroProduct[];
  isLowPowerMode?: boolean;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);

  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const header = headerRef.current;
    const images = imagesRef.current;
    const rowA = rowARef.current;
    const rowB = rowBRef.current;
    if (!stage || !header || !images || !rowA || !rowB) return;

    // Reduced motion: land on the lit resting state, never listen to scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      images.style.opacity = "0.9";
      images.style.filter = "grayscale(0)";
      images.style.pointerEvents = "auto";
      return;
    }

    const lift = isLowPowerMode ? 24 : 48; // px the collage outruns the page by
    const xTravel = isLowPowerMode ? 4 : 8; // % the rows counter-slide

    const apply = (p: number) => {
      const lit = smoothstep(0, 0.4, p); // collage wakes up
      const gone = smoothstep(0, 0.45, p); // title clears out

      header.style.transform = `translate3d(0, ${-32 * gone}%, 0)`;
      header.style.opacity = String(1 - gone);

      images.style.opacity = String(lerp(0.22, 0.9, lit));
      images.style.filter = `grayscale(${lerp(0.85, 0, lit)})`;
      images.style.transform = `translate3d(0, ${-lift * p}px, 0)`;
      // Keep the collage inert until the title is out of the way.
      images.style.pointerEvents = p > 0.05 ? "auto" : "none";

      rowA.style.transform = `translate3d(${xTravel * p}%, 0, 0)`;
      rowB.style.transform = `translate3d(${-xTravel * p}%, 0, 0)`;
    };

    let frame = 0;
    let lastP = -1;

    const read = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();

      // When Marvin is open the shell is the scroller and its top edge sits at
      // --marvin-inset, not 0. Measure against whichever box is scrolling.
      const shell =
        document.documentElement.dataset.marvinOpen === "true"
          ? document.getElementById("marvin-page-shell")
          : null;
      const viewTop = shell ? shell.getBoundingClientRect().top : 0;
      const span =
        rect.height || (shell ? shell.clientHeight : window.innerHeight);

      const p = clamp01((viewTop - rect.top) / span);
      if (Math.abs(p - lastP) < 0.001) return;
      lastP = p;
      apply(p);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();

    // scroll doesn't bubble — capture also catches the shell's scroller.
    window.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", schedule);

    // The frame animates open/closed over 350ms; RO tracks it the whole way.
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(stage);

    // Toggling Marvin swaps which element scrolls — re-measure immediately.
    const modeObserver = new MutationObserver(schedule);
    modeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-marvin-open"],
    });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
      modeObserver.disconnect();
    };
  }, [isLowPowerMode]);

  return (
    <section
      ref={stageRef}
      className="relative h-[var(--frame-h,100dvh)] w-full overflow-hidden"
    >
      <Header headerRef={headerRef} />

      <div
        ref={imagesRef}
        data-hero-images
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex min-h-full flex-col justify-center pt-28 will-change-transform"
        style={{ opacity: 0.22, filter: "grayscale(0.85)" }}
      >
        <div
          ref={rowARef}
          className={cn(
            "mb-8 flex flex-row-reverse space-x-16 space-x-reverse will-change-transform md:mb-10 md:space-x-20",
            isLowPowerMode && "mb-6 space-x-10"
          )}
        >
          {firstRow.map((product, i) => (
            <ProductCard
              product={product}
              key={`a-${i}-${product.title}`}
              isLowPowerMode={isLowPowerMode}
            />
          ))}
        </div>
        <div
          ref={rowBRef}
          className={cn(
            "mb-0 flex flex-row space-x-16 will-change-transform md:space-x-20",
            isLowPowerMode && "space-x-10"
          )}
        >
          {secondRow.map((product, i) => (
            <ProductCard
              product={product}
              key={`b-${i}-${product.title}`}
              isLowPowerMode={isLowPowerMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const Header = ({
  headerRef,
}: {
  headerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const t = useTranslations("projectHeader");
  return (
    <div
      ref={headerRef}
      data-hero-header
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center px-4 pt-[18vh] text-center will-change-transform md:pt-[20vh]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <h1
          className="text-2xl font-bold uppercase tracking-tight dark:text-white md:text-6xl lg:text-7xl"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />

        <p
          className="mx-auto mt-4 max-w-xl text-sm text-neutral-400 dark:text-neutral-300 md:mt-6 md:max-w-2xl md:text-lg"
          dangerouslySetInnerHTML={{ __html: t.raw("subtitle") }}
        />

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <div className="flex flex-col items-center gap-[3px] md:gap-1">
            {SCROLL_CUBE_INDICES.map((i) => (
              <motion.span
                key={i}
                className="h-[3px] w-[3px] shrink-0 rounded-[1px] bg-white md:h-1 md:w-1"
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-500">
            Scroll
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  isLowPowerMode,
}: {
  product: HeroProduct;
  isLowPowerMode?: boolean;
}) => {
  return (
    <motion.div
      whileHover={isLowPowerMode ? {} : { y: -20 }}
      className={cn(
        // 16:9 — these are web projects, so the tiles are shaped like the
        // browser screenshots that fill them. Height derives from width so
        // the frame matches the asset instead of cropping it into portrait.
        "group/product relative aspect-video shrink-0",
        isLowPowerMode ? "w-[12rem] md:w-[20rem]" : "w-[16rem] md:w-[30rem]"
      )}
    >
      <Link href={product.href} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height={540}
          width={960}
          className="absolute inset-0 h-full w-full object-cover object-center"
          alt={product.title}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80" />
      <h2 className="pointer-events-none absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
