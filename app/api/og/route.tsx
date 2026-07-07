import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            marginBottom: "30px",
            fontSize: "48px",
          }}
        >
          ✂️
        </div>

        <div
          style={{
            fontSize: "68px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "16px",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Remove BG Online
        </div>

        <div
          style={{
            fontSize: "30px",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          Free AI Background Remover — No Signup, No Watermark
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["100% Private", "Instant AI", "HD Quality", "Free Forever"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "8px 20px",
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            ),
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "22px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          removebg.online
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
