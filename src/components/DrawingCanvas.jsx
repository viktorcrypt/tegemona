import React from "react";

// stickers: [{date, x, y, author}]
export default function DrawingCanvas({ stickers }) {
  return (
    <div
      style={{
        width: 800,
        height: 500,
        background: "#232323",
        borderRadius: 20,
        border: "2px solid #282828",
        position: "relative",
        overflow: "hidden",
        margin: "28px 0"
      }}
    >
      {stickers.map((sticker, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: sticker.x,
            top: sticker.y,
            background: "#ffae42",
            color: "#222",
            borderRadius: 8,
            padding: "12px 22px",
            fontSize: 22,
            fontWeight: "bold",
            boxShadow: "0 2px 12px #0006",
            border: "2px solid #fff7",
            userSelect: "none"
          }}
          title={sticker.author}
        >
          {sticker.date}
        </div>
      ))}
    </div>
  );
}
