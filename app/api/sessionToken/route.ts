import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import users from "@/data/User";

export async function GET(req: NextRequest) {
  const JWT_SECRETE: any = process.env.JWT_SECRETE;
  const headersList = headers();
  const bearerToken: string | null = headersList.get("authorization");
  const token: string | undefined = bearerToken?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      {
        valid: false,
        msg: "no token found",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRETE) as { username: string };
    const user = users.find((user) => user.username === decoded.username);
    if (user) {
      return NextResponse.json(
        {
          valid: true,
          user: { username: user.username },
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          valid: false,
          msg: "no user Found",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        msg: error,
      },
      {
        status: 401,
      }
    );
  }
}
