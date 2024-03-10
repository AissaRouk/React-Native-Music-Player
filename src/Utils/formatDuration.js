export default function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Use padStart to ensure two digits for seconds (e.g., 5 seconds becomes "05")
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${minutes}:${formattedSeconds}`;
}
