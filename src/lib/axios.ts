import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: "/api/v1",
  headers: { Accept: "application/json" },
})

export const make = async (config, showNotifications: boolean = true) => {
  if (showNotifications) {
    return toast
      .promise(
        api.request(config),
        {
          loading: "Loading...",
          success: ({ data }) => data?.message || "Request successful!",
          error: (err) => err.response.data?.message || "An error occurred.",
        },
        {
          position: "bottom-right",
        }
      )
      .then((res) => res.data)
  } else {
    const response = await api.request(config)
    return response.data
  }
}

// Set your default authorization token if needed
// api.defaults.headers.common["Authorization"] = "AUTH_TOKEN";

export default api
