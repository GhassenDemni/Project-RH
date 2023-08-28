export default function RoleBadge({ role }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 text-xs ${
        role === "RSSI"
          ? "bg-purple-700 text-white"
          : role === "ADMIN"
          ? "bg-yellow-500 text-white"
          : role === "DIRECTOR_GENERAL"
          ? "bg-green-500 text-white"
          : role === "CHEF_DEPARTMENT"
          ? "bg-pink-500 text-white"
          : role === "TECHNICIAN"
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-white"
      }`}
    >
      {role}
    </span>
  )
}
