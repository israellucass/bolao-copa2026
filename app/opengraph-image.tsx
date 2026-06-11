import { ImageResponse } from "next/og";
import { getMascotDataUrl } from "@/lib/og-assets";
import { APP_SUBTITLE, APP_TITLE } from "@/lib/theme";

export const alt = APP_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const mascot = await getMascotDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #0c0a09 0%, #064e3b 45%, #0c0a09 100%)",
          padding: 40,
        }}
      >
        <img
          src={mascot}
          alt=""
          width={560}
          height={305}
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 900,
            color: "#fef3c7",
            letterSpacing: "-0.02em",
          }}
        >
          {APP_TITLE}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 30,
            color: "#a8a29e",
          }}
        >
          {APP_SUBTITLE}
        </div>
      </div>
    ),
    { ...size }
  );
}
