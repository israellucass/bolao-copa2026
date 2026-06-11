import { ImageResponse } from "next/og";
import { getMascotDataUrl } from "@/lib/og-assets";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const mascot = await getMascotDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0a09",
          borderRadius: 36,
          border: "4px solid #a3e635",
        }}
      >
        <img
          src={mascot}
          alt=""
          width={160}
          height={87}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
