import { useMemo } from "react";

const NEUTRAL = "rgba(255,255,255,0.06)";

const ORB_CONFIG = [
  { size: "55vmax", top: "-10%", left: "-10%", opacity: 0.35, duration: "7s",  kf: "plasma1" },
  { size: "45vmax", bottom: "-12%", right: "-8%", opacity: 0.30, duration: "9s",  kf: "plasma2" },
  { size: "35vmax", top: "35%", left: "45%", opacity: 0.25, duration: "11s", kf: "plasma3" },
];

const KEYFRAMES = `
@keyframes plasma1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30%, 20%) scale(1.3); }
  66% { transform: translate(10%, 40%) scale(0.9); }
}
@keyframes plasma2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25%, -15%) scale(1.2); }
  66% { transform: translate(-40%, -30%) scale(0.85); }
}
@keyframes plasma3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30%, 20%) scale(1.4); }
}
`;

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function BackgroundPlasma({ color }) {
  const orbColors = useMemo(() => {
    if (!color) return ORB_CONFIG.map(() => NEUTRAL);
    return ORB_CONFIG.map((orb) => hexToRgba(color, orb.opacity));
  }, [color]);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        {ORB_CONFIG.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              borderRadius: "50%",
              backgroundColor: orbColors[i],
              filter: "blur(70px)",
              transition: "background-color 1.5s ease-in-out",
              animation: `${orb.kf} ${orb.duration} ease-in-out infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </>
  );
}
