import { ImageResponse } from "next/og";
import { getMascotDataUrl } from "@/lib/og-assets";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
        }}
      >
        <img
          src={mascot}
          alt=""
          width={30}
          height={16}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
