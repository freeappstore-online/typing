import { useRef, useEffect } from "react";

interface WpmChartProps {
  data: readonly number[];
  width?: number;
  height?: number;
  label?: string;
}

export default function WpmChart({
  data,
  width = 400,
  height = 150,
  label = "WPM Over Time",
}: WpmChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Get CSS custom properties
    const style = getComputedStyle(document.documentElement);
    const accent = style.getPropertyValue("--accent").trim() || "#2563eb";
    const muted = style.getPropertyValue("--muted").trim() || "#6b7280";
    const line = style.getPropertyValue("--line").trim() || "#e5e7eb";
    const ink = style.getPropertyValue("--ink").trim() || "#1a1a1a";

    // Clear
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 25, right: 15, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxWpm = Math.max(20, ...data) * 1.1;
    const minWpm = 0;

    // Grid lines
    ctx.strokeStyle = line;
    ctx.lineWidth = 0.5;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = Math.round(maxWpm - (maxWpm - minWpm) * (i / gridLines));
      ctx.fillStyle = muted;
      ctx.font = "10px Manrope, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(String(val), padding.left - 5, y + 3);
    }

    // X-axis labels
    ctx.fillStyle = muted;
    ctx.font = "10px Manrope, sans-serif";
    ctx.textAlign = "center";
    const xLabelStep = Math.max(1, Math.floor(data.length / 6));
    for (let i = 0; i < data.length; i += xLabelStep) {
      const x = padding.left + (i / Math.max(1, data.length - 1)) * chartW;
      ctx.fillText(`${i + 1}s`, x, height - 5);
    }

    // Draw line
    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = 0; i < data.length; i++) {
        const x = padding.left + (i / (data.length - 1)) * chartW;
        const val = data[i] ?? 0;
        const y = padding.top + chartH - ((val - minWpm) / (maxWpm - minWpm)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill under the line
      const lastVal = data[data.length - 1] ?? 0;
      const lastX = padding.left + chartW;
      const lastY = padding.top + chartH - ((lastVal - minWpm) / (maxWpm - minWpm)) * chartH;
      ctx.lineTo(lastX, lastY);
      ctx.lineTo(lastX, padding.top + chartH);
      ctx.lineTo(padding.left, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = accent + "18";
      ctx.fill();
    } else if (data.length === 1) {
      const x = padding.left;
      const val = data[0] ?? 0;
      const y = padding.top + chartH - ((val - minWpm) / (maxWpm - minWpm)) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    }

    // Title
    ctx.fillStyle = ink;
    ctx.font = "bold 11px Manrope, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(label, padding.left, 14);
  }, [data, width, height, label]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="rounded-lg"
    />
  );
}
