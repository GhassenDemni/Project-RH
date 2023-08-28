import { RateLimiter } from "limiter"

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 20 * 60 * 1000,
  fireImmediately: true,
})

export default limiter
