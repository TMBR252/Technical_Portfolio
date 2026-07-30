"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroParallax = ({
  products,
  isLowPowerMode,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  isLowPowerMode?: boolean;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const header = headerRef.current;
    const images = imagesRef.current;
    const rowA = rowARef.current;
    const rowB = rowBRef.current;
    if (!track || !stage || !header || !images || !rowA || !rowB) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(images, {
        opacity: 0.2,
        filter: "grayscale(0.85)",
        y: isLowPowerMode ? 80 : 120,
        pointerEvents: "auto",
      });
      gsap.set(header, { clearProps: "all" });
      gsap.set(stage, { height: "100dvh" });
      return;
    }

    const imageRestY = isLowPowerMode ? 40 : 56;
    const imageExitY = isLowPowerMode ? -200 : -280;
    const xTravel = isLowPowerMode ? 6 : 12;

    const setImagesClickable = (on: boolean) => {
      images.style.pointerEvents = on ? "auto" : "none";
    };

    const ctx = gsap.context(() => {
      gsap.set(images, {
        y: imageRestY,
        opacity: 0.18,
        filter: "grayscale(0.85)",
        pointerEvents: "none",
      });
      gsap.set(header, { yPercent: 0, opacity: 1 });
      gsap.set([rowA, rowB], { xPercent: 0 });
      gsap.set(stage, { height: "100dvh", overflow: "hidden" });
      setImagesClickable(false);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          // Longer runway = slower scrub (was too fast at ~140%)
          end: () => (isLowPowerMode ? "+=180%" : "+=220%"),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setImagesClickable(self.progress > 0.02);
          },
          // Collapse spent hero so the title block isn't parked under a black band
          onLeave: () => {
            gsap.set(stage, { height: 0, overflow: "hidden" });
            gsap.set(track, { height: 0, overflow: "hidden" });
          },
          onEnterBack: () => {
            gsap.set(track, { height: "auto", overflow: "visible" });
            gsap.set(stage, { height: "100dvh", overflow: "hidden" });
          },
        },
      });

      // Phase A — title drifts out slowly; collage brightens and holds
      tl.to(
        header,
        { yPercent: -110, opacity: 0, ease: "none", duration: 2.2 },
        0
      );
      tl.to(rowA, { xPercent: xTravel, ease: "none", duration: 4 }, 0);
      tl.to(rowB, { xPercent: -xTravel, ease: "none", duration: 4 }, 0);
      tl.to(
        images,
        {
          opacity: 0.88,
          filter: "grayscale(0)",
          ease: "none",
          duration: 2.0,
        },
        0
      );

      // Phase B — long soft fade (was ~0.45 — felt like a snap)
      tl.to(images, { y: imageExitY, ease: "none", duration: 1.6 }, 2.4);
      tl.to(images, { opacity: 0, ease: "none", duration: 1.6 }, 2.4);
    }, track);

    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenisScroll);

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      lenis?.off("scroll", onLenisScroll);
      ctx.revert();
    };
  }, [isLowPowerMode, lenis, products.length]);

  return (
    <>
      <section ref={trackRef} className="relative w-full">
        <div
          ref={stageRef}
          className="relative h-[100dvh] w-full overflow-hidden"
        >
          <Header headerRef={headerRef} />

          <div
            ref={imagesRef}
            data-hero-images
            className="pointer-events-none absolute inset-x-0 top-0 z-0 flex min-h-full flex-col justify-center pt-6 will-change-transform"
          >
            <div
              ref={rowARef}
              className={cn(
                "mb-8 flex flex-row-reverse space-x-16 space-x-reverse will-change-transform md:mb-10 md:space-x-20",
                isLowPowerMode && "mb-6 space-x-10"
              )}
            >
              {firstRow.map((product) => (
                <ProductCard
                  product={product}
                  key={product.title}
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
              {secondRow.map((product) => (
                <ProductCard
                  product={product}
                  key={product.title}
                  isLowPowerMode={isLowPowerMode}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Own section below the hero — no negative margin, no overlap */}
      <section className="relative z-10 bg-background px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14">
        <div className="container-creative text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Work I&apos;m <span className="text-[#D1FF4D]">Proud</span> Of
            </h2>
          </div>
        </div>
      </section>
    </>
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
      <div className="pointer-events-auto mx-auto flex w-full max-w-7xl flex-col items-center">
        <h1
          className="text-2xl font-bold uppercase tracking-tight dark:text-white md:text-6xl lg:text-7xl"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <div className="relative h-10 w-px overflow-hidden bg-gradient-to-b from-transparent via-neutral-400 to-transparent md:h-16">
            <motion.div
              className="absolute top-0 h-1/2 w-full bg-white blur-[1px]"
              animate={{ y: [0, 40, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
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
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  isLowPowerMode?: boolean;
}) => {
  return (
    <motion.div
      whileHover={isLowPowerMode ? {} : { y: -20 }}
      key={product.title}
      className={cn(
        "group/product relative shrink-0",
        isLowPowerMode
          ? "h-48 w-[12rem] md:h-64 md:w-[20rem]"
          : "h-64 w-[16rem] md:h-96 md:w-[30rem]"
      )}
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height={600}
          width={600}
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </a>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80" />
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
