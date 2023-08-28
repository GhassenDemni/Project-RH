import { NextRequest, NextResponse } from "next/server"
import { getSession } from "next-auth/react"
import { z } from "zod"

const bodySchema = z.object({
  email: z.string().email().nonempty().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { email } = bodySchema.parse(await req.json())
    // const { expires } = await sendVerificationLink(email)

    return NextResponse.json({
      message: `Verification link sent to email`,
      result: { expires },
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        error: error,
      },
      { status: 500 }
    )
  }
}
