import { ImageResponse } from "next/og";
export const alt =
  "Ntale Kasim — Software engineer. Human thinking, digital possibilities.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#171918",
        color: "#eeeae1",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "70px",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <span style={{ fontSize: 22, letterSpacing: 6, color: "#91b79c" }}>
        SOFTWARE ENGINEER / OPEN-SOURCE BUILDER
      </span>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 112, fontWeight: 700, letterSpacing: -8 }}>
          NTALE KASIM.
        </span>
        <span style={{ fontSize: 32, color: "#b6b8ab" }}>
          Human thinking. Digital possibilities.
        </span>
      </div>
      <span style={{ fontSize: 20 }}>
        FULL-STACK DEVELOPMENT · DATA · OPEN SOURCE
      </span>
    </div>,
    size,
  );
}
