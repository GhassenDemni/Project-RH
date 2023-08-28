import { NextRequest, NextResponse } from "next/server" // Import the required Next.js modules
import prisma from "@/lib/prisma"
import getSession from "@/lib/session"

export async function isAdmin() {
  const session = await getSession()
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    const error = new Error("Only admins can access this route")
    error.statusCode = 401 // Unauthorized status code
    throw error
  } else {
    return session.user
  }
}

// Function to assign a role to a user
export async function PUT(req: NextRequest, res: NextRequest) {
  try {
    // Check if the current user making the request is an admin
    await isAdmin()
    // Parse the JSON data from the request body
    const { user_id, role_id } = await req.json()

    // Fetch the user from the database
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    })

    // Check if the user exists in the database
    if (!userToUpdate) {
      return NextResponse.json(
        {
          message: `User with ID ${user_id} not found`,
          result: null,
        },
        { status: 404 }
      )
    }

    // Fetch the role from the database
    const role = await prisma.role.findUnique({
      where: {
        id: role_id,
      },
    })

    // Check if the role exists in the database
    if (!role) {
      return NextResponse.json(
        {
          message: `Role with ID ${role_id} not found`,
          result: null,
        },
        { status: 404 }
      )
    }

    // Update the role of the user
    const updatedUser = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        role_id: role_id,
      },
    })

    return NextResponse.json(
      {
        message: `${role.name} role assigned successfully to ${userToUpdate.name}`,
        result: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    )
  }
}
