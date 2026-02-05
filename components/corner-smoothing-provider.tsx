'use client';

import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { getSvgPath } from 'figma-squircle';
import mergeRefs from 'merge-refs';

type CornerSmoothingOptions = {
  smoothing?: number;
  disabled?: boolean;
};

type CornerSmoothingProps = React.HTMLAttributes<HTMLDivElement> &
  CornerSmoothingOptions & {
    asChild?: boolean;
  };

const parseRadius = (value: string) => {
  if (!value || value.includes('%')) return 0;
  const match = value.match(/-?\d*\.?\d+/);
  if (!match) return 0;
  return Number.parseFloat(match[0]);
};

const getCornerRadii = (style: CSSStyleDeclaration) => {
  const topLeft = parseRadius(style.borderTopLeftRadius);
  const topRight = parseRadius(style.borderTopRightRadius);
  const bottomRight = parseRadius(style.borderBottomRightRadius);
  const bottomLeft = parseRadius(style.borderBottomLeftRadius);

  return {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    max: Math.max(topLeft, topRight, bottomRight, bottomLeft),
  };
};

const applySquircle = (el: HTMLElement, smoothing: number) => {
  const style = getComputedStyle(el);
  const radii = getCornerRadii(style);
  if (!radii.max || radii.max <= 0) return;

  const rect = el.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  if (width <= 1 || height <= 1) return;

  const maxRadius = Math.min(radii.max, Math.min(width, height) / 2);

  const path = getSvgPath({
    width,
    height,
    cornerRadius: maxRadius,
    cornerSmoothing: smoothing,
    preserveSmoothing: true,
    topLeftCornerRadius: radii.topLeft || undefined,
    topRightCornerRadius: radii.topRight || undefined,
    bottomRightCornerRadius: radii.bottomRight || undefined,
    bottomLeftCornerRadius: radii.bottomLeft || undefined,
  });

  el.style.clipPath = `path('${path}')`;
  (el.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath =
    `path('${path}')`;
};

export const CornerSmoothing = forwardRef<HTMLDivElement, CornerSmoothingProps>(
  ({ smoothing = 1, disabled = false, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMemo(() => mergeRefs(localRef, ref), [ref]);

    useEffect(() => {
      if (disabled) return;
      const el = localRef.current;
      if (!el) return;

      const apply = () => applySquircle(el, smoothing);
      apply();

      const ro = new ResizeObserver(apply);
      ro.observe(el);

      return () => ro.disconnect();
    }, [disabled, smoothing]);

    return <div ref={mergedRef} {...props} />;
  },
);

CornerSmoothing.displayName = 'CornerSmoothing';
