import Image from "next/image";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

/** Maps charcoal/dark raster + SVG glyphs to readable light branding on dark UI. */
const lightOnDarkFilter =
  "[filter:invert(1)_brightness(1.16)_contrast(1.08)_saturate(0)]";

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
  /** Invert dark logo art for dark surfaces (PNG is tonal, not keyed white). */
  lightIcon?: boolean;
  /** Invert dark glyphs for dark UI (wordmark fills are charcoal). */
  lightWordmark?: boolean;
  priority?: boolean;
};

export function BrandMark({
  className,
  iconClassName,
  wordmarkClassName,
  showWordmark = true,
  lightIcon = true,
  lightWordmark = true,
  priority = false,
}: BrandMarkProps) {
  return (
    <span
      className={cn("inline-flex max-w-[min(100%,calc(100vw-112px))] items-center gap-3", className)}
      data-direction-neutral="true"
    >
      <Image
        src={siteConfig.brand.logo}
        alt=""
        width={160}
        height={107}
        priority={priority}
        className={cn(
          "h-11 w-auto max-h-[48px] shrink-0 object-contain object-left md:h-12 md:max-h-[52px]",
          lightIcon ? ["opacity-[0.96]", lightOnDarkFilter] : "opacity-[0.98] saturate-[0.92]",
          iconClassName
        )}
      />
      {showWordmark ? (
        <Image
          src={siteConfig.brand.wordmark}
          alt=""
          width={1203}
          height={288}
          priority={priority}
          unoptimized
          className={cn(
            // Tight viewBox in SVG crops excess canvas so type reads larger at a given CSS height.
            "hidden h-8 w-auto shrink-0 object-contain object-left sm:block sm:h-9 md:h-10 lg:h-11 xl:h-12 2xl:h-[52px]",
            lightWordmark
              ? ["-translate-y-[0.5px] opacity-[0.96]", lightOnDarkFilter]
              : "opacity-95",
            wordmarkClassName
          )}
        />
      ) : null}
      <span className="sr-only">{siteConfig.name}</span>
    </span>
  );
}
