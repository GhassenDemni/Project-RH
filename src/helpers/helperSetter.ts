interface Setter {
  [key: string]: Helper & { type?: "warn" | "error"; href: string }
}

interface Helper {
  message: string
  field: string
  href?: string
  type?: string
  code?: ErrorCode
  data?: {
    suggestions?: string[]
  }
}

enum ErrorCode {
  UserAlreadyExists,
  UserNotExists,
  WrongPassword,
  InvalidEmailFormat,
}

const helper_manager = (
  helper: Helper,
  setter: any,
  setFocus?: any,
  resetField?: any
) => {
  if (!helper || !setter || Object.keys(helper || {}).length < 1) return

  const href =
    helper?.code === ErrorCode.UserAlreadyExists && helper.field === "email"
      ? "login"
      : helper.code === ErrorCode.UserNotExists
      ? "register"
      : helper.code === ErrorCode.WrongPassword
      ? "forget-password"
      : ""

  const goTo = href
    ? href.substring(0, 1).toUpperCase() +
      href.substring(1).replace(/-/, " ") +
      "?"
    : ""

  const obj = {
    [helper.field]: {
      message: goTo ? helper.message + " " + goTo : helper.message,
      suggestions: helper?.data?.suggestions,
      type: helper?.type,
      href,
    },
  }

  if (helper.field) {
    resetField && resetField(helper.field)
    setFocus && setFocus(helper.field)
  }

  setter && setter(obj)
}

export default helper_manager
