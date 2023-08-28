import sendVerificationEmail from "@/actions/sendVerificationEmail"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    console.log(url)
    return NextResponse.json({
      message: "Email verifiyed email",
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
