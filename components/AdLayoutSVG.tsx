"use client";
import React, { useRef, useState, useEffect } from "react";

const fonts = ["Arial", "Georgia", "Impact", "Verdana", "Tahoma", "Times New Roman"];
type ElementType = "heading" | "subheading" | "cta";

interface AdLayoutSVGProps {
  imageUrl: string;
  layout: Layout;
  width?: number;
  height?: number;
  showControls?: boolean;
  pointerEventsNone?: boolean;
}

const svgWidth = 1080;
const svgHeight = 1080;

// Define types locally
export interface Styling {
  font_size: number;
  font_weight: string;
  text_align: "left" | "center" | "right";
  color: string;
  background_color: string;
  margin: number;
  font_family?: string;
}

export interface ElementData {
  bbox: { x: number; y: number; width: number; height: number };
  styling: Styling;
  text_content: string;
}

export interface Layout {
  id: string;
  style: string;
  elements: {
    heading: ElementData;
    subheading: ElementData;
    cta: ElementData;
  };
}

const AdLayoutSVG: React.FC<AdLayoutSVGProps> = ({ imageUrl, layout, width = 1080, height = 1080, showControls = true, pointerEventsNone = false }) => {
  const [elements, setElements] = useState(() => ({
    heading: { ...layout.elements.heading },
    subheading: { ...layout.elements.subheading },
    cta: { ...layout.elements.cta },
  }));
  const [selected, setSelected] = useState<ElementType | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset elements when layout changes
  useEffect(() => {
    setElements({
      heading: { ...layout.elements.heading },
      subheading: { ...layout.elements.subheading },
      cta: { ...layout.elements.cta },
    });
    setSelected(null);
  }, [layout]);

  // Drag handlers
  const handleDragStart = (type: ElementType, e: React.MouseEvent<SVGRectElement | SVGTextElement, MouseEvent>) => {
    dragOffset.current = {
      x: e.clientX - elements[type].bbox.x,
      y: e.clientY - elements[type].bbox.y,
    };
    setSelected(type);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    function onDragMove(ev: MouseEvent) {
      setElements((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          bbox: {
            ...prev[type].bbox,
            x: ev.clientX - dragOffset.current.x,
            y: ev.clientY - dragOffset.current.y,
          },
        },
      }));
    }
    function onDragEnd() {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    }
  };

  // Add a new handler for div drag
  const handleDivDragStart = (type: ElementType, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dragOffset.current = {
      x: e.clientX - elements[type].bbox.x,
      y: e.clientY - elements[type].bbox.y,
    };
    setSelected(type);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    function onDragMove(ev: MouseEvent) {
      setElements((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          bbox: {
            ...prev[type].bbox,
            x: ev.clientX - dragOffset.current.x,
            y: ev.clientY - dragOffset.current.y,
          },
        },
      }));
    }
    function onDragEnd() {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    }
  };

  // Resize handlers
  const handleResizeStart = (type: ElementType, e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    e.stopPropagation();
    setSelected(type);
    dragOffset.current = {
      x: e.clientX - (elements[type].bbox.x + elements[type].bbox.width),
      y: e.clientY - (elements[type].bbox.y + elements[type].bbox.height),
    };
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", onResizeEnd);
    function onResizeMove(ev: MouseEvent) {
      setElements((prev) => {
        const newWidth = Math.max(24, ev.clientX - prev[type].bbox.x - dragOffset.current.x);
        const newHeight = Math.max(24, ev.clientY - prev[type].bbox.y - dragOffset.current.y);
        return {
          ...prev,
          [type]: {
            ...prev[type],
            bbox: {
              ...prev[type].bbox,
              width: newWidth,
              height: newHeight,
            },
          },
        };
      });
    }
    function onResizeEnd() {
      window.removeEventListener("mousemove", onResizeMove);
      window.removeEventListener("mouseup", onResizeEnd);
    }
  };

  // Style change handler
  const handleStyleChange = (type: ElementType, key: keyof Styling, value: any) => {
    setElements((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        styling: {
          ...prev[type].styling,
          [key]: value,
        },
      },
    }));
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", pointerEvents: pointerEventsNone ? "none" : undefined }}
      >
        <image href={imageUrl} x={0} y={0} width={width} height={height} />
        {(["heading", "subheading", "cta"] as ElementType[]).map((type) => {
          const el = elements[type];
          // scale positions and sizes
          const scaleX = width / 1080;
          const scaleY = height / 1080;
          const boxX = el.bbox.x * scaleX;
          const boxY = el.bbox.y * scaleY;
          const boxW = el.bbox.width * scaleX;
          const boxH = el.bbox.height * scaleY;
          let justifyContent = "center";
          if (el.styling.text_align === "left") justifyContent = "flex-start";
          if (el.styling.text_align === "right") justifyContent = "flex-end";
          return (
            <g key={type}>
              {/* Background rect */}
              <rect
                x={boxX}
                y={boxY}
                width={boxW}
                height={boxH}
                fill={el.styling.background_color}
                rx={12 * scaleX}
                style={{ cursor: showControls ? "move" : "default" }}
                onMouseDown={showControls && !pointerEventsNone ? (e) => handleDragStart(type, e) : undefined}
              />
              {/* Text using foreignObject for wrapping and alignment */}
              <foreignObject
                x={boxX}
                y={boxY}
                width={boxW}
                height={boxH}
                style={{ pointerEvents: showControls && !pointerEventsNone ? "auto" : "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent,
                    fontSize: el.styling.font_size * scaleY,
                    fontWeight: el.styling.font_weight,
                    color: el.styling.color,
                    fontFamily: el.styling.font_family || "Arial",
                    textAlign: el.styling.text_align,
                    overflow: "hidden",
                    wordBreak: "break-word",
                    userSelect: "none",
                    padding: 0,
                    margin: 0,
                  }}
                  onMouseDown={showControls && !pointerEventsNone ? (e) => handleDivDragStart(type, e) : undefined}
                >
                  {el.text_content}
                </div>
              </foreignObject>
              {/* Resize handle (bottom right) */}
              {showControls && !pointerEventsNone && selected === type && (
                <rect
                  x={boxX + boxW - 12 * scaleX}
                  y={boxY + boxH - 12 * scaleY}
                  width={12 * scaleX}
                  height={12 * scaleY}
                  fill="#333"
                  style={{ cursor: "nwse-resize" }}
                  onMouseDown={(e) => handleResizeStart(type, e)}
                />
              )}
            </g>
          );
        })}
      </svg>
      {/* Controls */}
      {showControls && !pointerEventsNone && selected && (
        <div className="flex flex-col gap-4 min-w-[200px]">
          <h3 className="font-bold mb-2 capitalize">Edit {selected}</h3>
          <label className="text-sm">Color</label>
          <input
            type="color"
            value={elements[selected].styling.color}
            onChange={(e) => handleStyleChange(selected, "color", e.target.value)}
          />
          <label className="text-sm">Background</label>
          <input
            type="color"
            value={elements[selected].styling.background_color}
            onChange={(e) => handleStyleChange(selected, "background_color", e.target.value)}
          />
          <label className="text-sm">Font</label>
          <select
            value={elements[selected].styling.font_family || "Arial"}
            onChange={(e) => handleStyleChange(selected, "font_family", e.target.value)}
          >
            {fonts.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <label className="text-sm">Font Size</label>
          <input
            type="number"
            min={8}
            max={200}
            value={elements[selected].styling.font_size}
            onChange={(e) => handleStyleChange(selected, "font_size", Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
};

export default AdLayoutSVG; 