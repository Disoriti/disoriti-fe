"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Candidate, DisoritiLayout, ImageRenderedSize, SceneDigest, ElementBox } from "@/lib/vision-layout-types";

type RendererProps = {
  imageUrl: string;
  layout: DisoritiLayout | null;
  scene: SceneDigest | null;
  initialCandidateIndex?: number;
  showSafeArea?: boolean;
  debugOutlineOverflow?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

type Size = { w: number; h: number };

function useResizeObserver<T extends HTMLElement>(onResize: (size: Size) => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        onResize({ w: cr.width, h: cr.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onResize]);
  return ref;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function anchorToTranslate(anchor: ElementBox["anchor"]): string {
  switch (anchor) {
    case "tl": return "translate(0%, 0%)";
    case "tc": return "translate(-50%, 0%)";
    case "tr": return "translate(-100%, 0%)";
    case "cl": return "translate(0%, -50%)";
    case "cc": return "translate(-50%, -50%)";
    case "cr": return "translate(-100%, -50%)";
    case "bl": return "translate(0%, -100%)";
    case "bc": return "translate(-50%, -100%)";
    case "br": return "translate(-100%, -100%)";
    default: return "translate(0%, 0%)";
  }
}

function anchorToOrigin(anchor: ElementBox["anchor"]): string {
  switch (anchor) {
    case "tl": return "top left";
    case "tc": return "top center";
    case "tr": return "top right";
    case "cl": return "center left";
    case "cc": return "center";
    case "cr": return "center right";
    case "bl": return "bottom left";
    case "bc": return "bottom center";
    case "br": return "bottom right";
    default: return "top left";
  }
}

export const VisionLayoutRenderer: React.FC<RendererProps> = ({
  imageUrl,
  layout,
  scene,
  initialCandidateIndex = 0,
  showSafeArea = true,
  debugOutlineOverflow = false,
  className,
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(initialCandidateIndex);
  const [renderedSize, setRenderedSize] = useState<ImageRenderedSize>({ w: 0, h: 0 });
  const containerRef = useResizeObserver<HTMLDivElement>((size) => setRenderedSize(size));

  const imageNaturalSize = scene?.image_size ?? [1, 1];
  const scaleX = renderedSize.w / imageNaturalSize[0];
  const scaleY = renderedSize.h / imageNaturalSize[1];
  const uniformScale = Math.min(scaleX, scaleY) || 1;

  const candidates: Candidate[] = layout?.candidates ?? [];
  const candidate = candidates[activeIndex];

  useEffect(() => {
    if (!layout) return;
    if (activeIndex >= (layout.candidates?.length ?? 0)) {
      setActiveIndex(0);
    }
  }, [layout, activeIndex]);

  const safeArea = layout?.meta.safe_area ?? [0, 0, 1, 1];

  const containerStyles: React.CSSProperties = useMemo(() => ({
    position: "relative",
    width: "100%",
    aspectRatio: layout?.meta.aspect_ratio || undefined,
    overflow: "hidden",
    ...style,
  }), [layout?.meta.aspect_ratio, style]);

  const backgroundStyles: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const elementBoxToStyle = (el: ElementBox): React.CSSProperties => {
    // Clamp bbox defensively
    const [bx, by, bw, bh] = [
      clamp01(el.bbox[0]),
      clamp01(el.bbox[1]),
      Math.min(1, Math.max(0, el.bbox[2])),
      Math.min(1, Math.max(0, el.bbox[3]))
    ];

    const fontPx = (el.style.font_size_px || 14) * uniformScale;
    const letterPx = (el.style.letter_spacing || 0) * scaleX;
    const strokePx = (el.style.stroke_width || 0) * uniformScale;
    const blurPx = (el.style.background_blur || 0) * uniformScale;

    const justifyContent = el.style.text_align === "center" ? "center" : (el.style.text_align === "right" ? "flex-end" : "flex-start");

    const supportsTextStroke = typeof window !== 'undefined' && CSS && (CSS as any).supports && (CSS as any).supports("-webkit-text-stroke", "1px black");

    const textStrokeDecl: React.CSSProperties = supportsTextStroke && el.style.stroke && strokePx > 0
      ? ({ WebkitTextStroke: `${strokePx}px ${el.style.stroke}` } as any)
      : ({ textShadow: el.style.stroke ? `-${strokePx}px 0 ${el.style.stroke}, ${strokePx}px 0 ${el.style.stroke}, 0 -${strokePx}px ${el.style.stroke}, 0 ${strokePx}px ${el.style.stroke}` : undefined });

    return {
      position: "absolute",
      left: `${bx * 100}%`,
      top: `${by * 100}%`,
      width: `${bw * 100}%`,
      height: `${bh * 100}%`,
      transform: `${anchorToTranslate(el.anchor)} rotate(${el.rotation_deg || 0}deg)`,
      transformOrigin: anchorToOrigin(el.anchor),
      display: "flex",
      alignItems: "center",
      justifyContent,
      textAlign: el.style.text_align,
      color: el.style.fill,
      fontFamily: el.style.font_family || "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      fontWeight: el.style.font_weight as any,
      fontSize: `${fontPx}px`,
      letterSpacing: `${letterPx}px`,
      lineHeight: el.style.line_height || 1.2,
      overflow: "hidden",
      textOverflow: "ellipsis",
      wordBreak: "break-word",
      pointerEvents: "none",
      ...textStrokeDecl,
    };
  };

  const backgroundLayerStyle = (el: ElementBox): React.CSSProperties => {
    const blurPx = (el.style.background_blur || 0) * uniformScale;
    return {
      position: "absolute",
      inset: 0,
      background: el.style.background_fill || undefined,
      backdropFilter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
      borderRadius: 8,
      zIndex: 0,
    };
  };

  const isOutsideSafeArea = (el: ElementBox): boolean => {
    const [sx, sy, sw, sh] = safeArea;
    const [ex, ey, ew, eh] = el.bbox;
    if (ew <= 0 || eh <= 0) return false;
    const within = ex >= sx && ey >= sy && ex + ew <= sx + sw && ey + eh <= sy + sh;
    return !within;
  };

  const elementTextStyle = (el: ElementBox): React.CSSProperties => ({
    position: "relative",
    zIndex: 1,
    width: "100%",
    padding: "6px 8px",
    display: "-webkit-box",
    WebkitLineClamp: 6 as any,
    WebkitBoxOrient: "vertical" as any,
    overflow: "hidden",
  });

  if (!layout || !scene || !candidate) {
    return (
      <div ref={containerRef} className={className} style={containerStyles}>
        <div style={backgroundStyles} />
      </div>
    );
  }

  const { heading, subheading, cta } = candidate.elements;

  return (
    <div ref={containerRef} className={className} style={containerStyles}>
      <div style={backgroundStyles} />

      {/* Safe area overlay */}
      {showSafeArea && (
        <div
          style={{
            position: "absolute",
            left: `${safeArea[0] * 100}%`,
            top: `${safeArea[1] * 100}%`,
            width: `${safeArea[2] * 100}%`,
            height: `${safeArea[3] * 100}%`,
            border: "1px dashed rgba(0, 255, 0, 0.6)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}

      {[{ key: "heading", el: heading }, { key: "subheading", el: subheading }, { key: "cta", el: cta }].map(({ key, el }) => (
        <div key={key} style={elementBoxToStyle(el)}>
          {/* background layer */}
          {el.style.background_fill && (
            <div style={backgroundLayerStyle(el)} />
          )}
          {/* text */}
          <div style={{ ...elementTextStyle(el), textAlign: el.style.text_align }}>
            {el.text}
          </div>
          {/* debug overflow outside safe area */}
          {debugOutlineOverflow && isOutsideSafeArea(el) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                outline: "2px solid rgba(255,0,0,0.6)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      ))}

      {/* Candidate switcher */}
      {candidates.length > 1 && (
        <div
          style={{
            position: "absolute",
            left: 8,
            bottom: 8,
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(0,0,0,0.4)",
            color: "#fff",
            borderRadius: 8,
            padding: "6px 8px",
            zIndex: 20,
          }}
        >
          <select
            value={activeIndex}
            onChange={(e) => setActiveIndex(Number(e.target.value))}
            style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6, padding: "4px 6px" }}
          >
            {candidates.map((c, idx) => (
              <option key={c.id} value={idx} style={{ color: "#000" }}>{`${c.id} (score ${c.score.toFixed(2)})`}</option>
            ))}
          </select>
          <div style={{ fontSize: 12, maxWidth: 280, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={candidate.design_notes}>
            {candidate.design_notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionLayoutRenderer;


