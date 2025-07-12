import React from "react";
import type { Layout, ElementData, Styling } from "./AdLayoutSVG";

interface AdLayoutPreviewProps {
  imageUrl: string;
  layout: Layout;
  width?: number;
  height?: number;
  logoImage?: string | null;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoColor?: string;
  logoBbox?: { x: number; y: number; width: number; height: number };
  filter?: string;
}

const AdLayoutPreview: React.FC<AdLayoutPreviewProps> = ({ imageUrl, layout, width = 500, height = 500, logoImage, logoPosition, logoColor, logoBbox, filter }) => {
  const { heading, subheading, cta } = layout.elements;
  const elements: { key: string; data: ElementData }[] = [
    { key: "heading", data: heading },
    { key: "subheading", data: subheading },
    { key: "cta", data: cta },
  ];

  // Helper to convert hex to rgba
  function hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: `url(${imageUrl}) center/cover no-repeat`,
        overflow: "hidden",
        filter: filter || undefined,
      }}
    >
      {elements.map(({ key, data }) => {
        // Match AdLayoutSVG background opacity logic
        const isCTA = key === 'cta';
        const bgOpacity = isCTA ? (data.styling.background_opacity ?? 1) : (data.styling.background_opacity ?? 0);
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: data.bbox.x * (width / 1080),
              top: data.bbox.y * (height / 1080),
              minWidth: 40,
              maxWidth: width,
              minHeight: 24,
              maxHeight: height,
              width: data.bbox.width * (width / 1080),
              height: data.bbox.height * (height / 1080),
              display: "flex",
              alignItems: "center",
              justifyContent: data.styling.text_align,
              fontSize: data.styling.font_size * (width / 1080),
              fontWeight: data.styling.font_weight,
              color: hexToRgba(data.styling.color, data.styling.color_opacity ?? 1),
              fontFamily: data.styling.font_family || "Montserrat, Poppins, Lato, Arial",
              textAlign: data.styling.text_align,
              background: hexToRgba(data.styling.background_color, bgOpacity),
              borderRadius: isCTA ? 8 : 0,
              boxShadow: isCTA ? '0 2px 8px rgba(0,0,0,0.12)' : undefined,
              padding: '8px 16px',
              overflow: 'hidden',
              wordBreak: 'break-word',
              userSelect: 'none',
              letterSpacing: `${data.styling.letter_spacing || 0}px`,
              textTransform: data.styling.text_transform || 'none',
              lineHeight: data.styling.line_height || 1.2,
              whiteSpace: 'pre-line',
              zIndex: 2,
            }}
          >
            {data.text_content}
          </div>
        );
      })}
      {/* Logo/Watermark */}
      {(() => {
        if (!logoBbox) return null;
        if (logoImage) {
          return (
            <img
              src={logoImage}
              alt="Logo"
              style={{
                position: 'absolute',
                left: logoBbox.x * (width / 1080),
                top: logoBbox.y * (height / 1080),
                width: logoBbox.width * (width / 1080),
                height: logoBbox.height * (width / 1080),
                objectFit: 'contain',
                zIndex: 10,
                pointerEvents: 'none',
                background: 'transparent',
              }}
            />
          );
        }
        return (
          <div
            style={{
              position: 'absolute',
              left: logoBbox.x * (width / 1080),
              top: logoBbox.y * (height / 1080),
              width: logoBbox.width * (width / 1080),
              height: logoBbox.height * (width / 1080),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, Poppins, Lato, Arial',
              fontWeight: 700,
              fontSize: Math.min(logoBbox.width * (width / 1080) * 0.3, 24),
              color: logoColor || '#fff',
              letterSpacing: 1,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            Disoriti
          </div>
        );
      })()}
    </div>
  );
};

export default AdLayoutPreview; 