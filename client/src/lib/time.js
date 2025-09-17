// src/lib/time.js

// Tiny relative-time util; good enough for UI
export function formatDistanceToNow(dateLike) {
  if (!dateLike) return '';
  const d = new Date(dateLike);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr  = Math.round(min / 60);
  const day = Math.round(hr / 24);

  if (sec < 60) return `${sec}s ago`;
  if (min < 60) return `${min}m ago`;
  if (hr  < 24) return `${hr}h ago`;
  return `${day}d ago`;
}
