"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data, isLowPowerMode }: { data: TimelineEntry[]; isLowPowerMode?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const updateHeight = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setHeight(rect.height);
        }
      };

      updateHeight();

      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-background font-sans"
      ref={containerRef}
    >
      {/* Same horizontal inset as page shell — no extra md:px-10 (that skewed the list) */}
      <div className="pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-[clamp(2rem,10vw,4.5rem)] font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 tracking-tight pb-2 leading-[1.1]"
            whileHover={{ scale: 1.02, originX: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Changelog from my journey
          </motion.h2>
          <motion.p
            className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl max-w-2xl leading-relaxed"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A timeline of roles, responsibilities, and professional growth across various organizations.
          </motion.p>
        </motion.div>
      </div>

      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-20 md:gap-10"
          >
            {/* Sticky year — dot centered on the spine at left-8 (32px) */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="absolute left-8 h-10 w-10 -translate-x-1/2 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-16 md:pl-4 pr-0">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        {/* Spine shares left-8 + -translate centering with the year dots */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-8 top-0 w-[2px] -translate-x-1/2 overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_80%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-brand via-brand/80 to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  );
};
