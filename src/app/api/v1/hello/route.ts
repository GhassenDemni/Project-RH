import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json(
      {
        message: `Hello from server`,
        result: null,
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something wrong",
        error: err,
      },
      { status: 500 }
    )
  }
}

export async function POST(req, res) {
  try {
    const data = await req.json()
    return NextResponse.json(
      {
        message: `Success request`,
        result: data,
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something wrong",
        error: err,
      },
      { status: 500 }
    )
  }
}
