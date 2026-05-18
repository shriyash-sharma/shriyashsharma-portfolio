import { ImageResponse } from "next/og";
import { seoConfig } from "@/lib/seo/config";

export const runtime = "edge";
export const alt = "Shriyash Sharma — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(145deg, #0a0a0b 0%, #141416 55%, #1a1a1f 100%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#a1a1aa",
            marginBottom: 24,
          }}
        >
          Engineering Portfolio
        </p>
        <p style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.05, maxWidth: 900 }}>
          Shriyash Sharma
        </p>
        <p style={{ fontSize: 28, color: "#d4d4d8", marginTop: 28, maxWidth: 820, lineHeight: 1.4 }}>
          {seoConfig.positioning}
        </p>
      </div>
    ),
    { ...size }
  );
}
