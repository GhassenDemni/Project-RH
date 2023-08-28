import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// get user with id
export async function GET(req : NextRequest, {params : {id}} , res : NextResponse) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })
    if (!user) {
      return Response.json(
        {
          msg: `No user found with this id ${userId}`,
          result: null,
        },
        { status: 404 }
      )
    }
    return Response.json({ msg: "Get User by ID", result: user })
  } catch (error) {
    console.log(error)
    return Response.json({ msg: error.message }, { status: 500 })
  }
}

// update user info with id
export async function PATCH(request) {
  const url = new URL(request.url)
  const user_id = url.pathname.split("/").pop()
  const data = await request.json()
  try {
    const {
      hobbies = [],
      address,
      password,
      current_password,
      new_password,
      confirm_new_password,
      email_updates,
      first_name,
      last_name,
      ...restUserData
    } = data
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { address: true },
    })

    if (!user) {
      return Response.json(
        {
          message: `User with this id ${user_id} not found`,
          result: null,
        },
        { status: 404 }
      )
    }

    // this check if is user has address so update if not is create address object
    const address_method = user?.address ? "update" : "create"

    const otherProps: any = {}

    if (first_name && last_name) {
      otherProps.first_name = first_name
      otherProps.last_name = last_name
      otherProps.name = first_name + " " + last_name
    }

    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: {
        ...otherProps,
        ...restUserData,
        address: {
          [address_method]: address,
        },
      },
      select: {
        id: true,
        email: true,
      },
    })

    return Response.json({
      message: "User updated",
      result: updatedUser,
    })
  } catch (error) {
    return Response.json(
      {
        message: error.message,
        error: error,
      },
      { status: 500 }
    )
  }
}


export async function DELETE(req: NextRequest, {params  : {id}} ,  res: NextRequest) {
  try {

    if (!id) {
      return NextResponse.json(
        {
          message: "user id required",
        },
        { status: 400 }
      );
    }

    // Check if the user exists before attempting to delete it
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: `user with id (${id}) not found`,
        },
        { status: 404 }
      );
    }

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: `User deleted (ID: ${deletedUser.id}, Name: ${deletedUser.name})`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          error: error,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}