export default function CVEBadge({ value, reverse = false, color = "" }) {
  const colorMap = reverse
    ? {
        HIGH: "bg-green-500 text-white",
        MEDIUM: "bg-yellow-500 text-white",
        LOW: "bg-red-700 text-white",
      }
    : {
        CRITICAL: "text-white-100 bg-black",
        HIGH: "bg-red-700 text-white",
        MEDIUM: "bg-yellow-500 text-white",
        LOW: "bg-green-500 text-white",
      }

  // Get the appropriate color class based on the value.
  const colorClass = color || colorMap[value] || "bg-gray-500 text-white"

  return (
    <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {value || "N/A"}
    </span>
  )
}
