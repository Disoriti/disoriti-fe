import React from "react";
import type { Layout, ElementData, Styling } from "./AdLayoutSVG";

interface AdLayoutPreviewProps {
  imageUrl: string;
  layout: Layout;
  width?: number;
  height?: number;
}

const AdLayoutPreview: React.FC<AdLayoutPreviewProps> = ({ imageUrl, layout, width = 500, height = 500 }) => {
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
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {elements.map(({ key, data }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            left: data.bbox.x * (width / 1080),
            top: data.bbox.y * (height / 1080),
            width: data.bbox.width * (width / 1080),
            height: data.bbox.height * (height / 1080),
            display: "flex",
            alignItems: "center",
            justifyContent: data.styling.text_align,
            fontSize: data.styling.font_size * (width / 1080),
            fontWeight: data.styling.font_weight,
            color: hexToRgba(data.styling.color, data.styling.color_opacity ?? 1),
            fontFamily: data.styling.font_family || "Arial",
            textAlign: data.styling.text_align,
            background: hexToRgba(data.styling.background_color, data.styling.background_opacity ?? 1),
            borderRadius: 8,
            padding: 5,
            overflow: "hidden",
            wordBreak: "break-word",
            userSelect: "none",
            letterSpacing: `${data.styling.letter_spacing || 0}px`,
            textTransform: data.styling.text_transform || "none",
          }}
        >
          {data.text_content}
        </div>
      ))}
    </div>
  );
};

export default AdLayoutPreview; 