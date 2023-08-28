import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params  : {id}} ,  res: NextRequest) {
    try {
  
      if (!id) {
        return NextResponse.json(
          {
            message: "Role id required",
          },
          { status: 400 }
        );
      }
  
      // Check if the role exists before attempting to delete it
      const existingRole = await prisma.role.findUnique({
        where: { id },
      });
  
      if (!existingRole) {
        return NextResponse.json(
          {
            message: `Role with id (${id}) not found`,
          },
          { status: 404 }
        );
      }
  
      // Delete the role
      const deletedRole = await prisma.role.delete({
        where: { id },
      });
  
      return NextResponse.json(
        {
          message: `Role deleted (ID: ${deletedRole.id}, Name: ${deletedRole.name})`,
          result: deletedRole,
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
  