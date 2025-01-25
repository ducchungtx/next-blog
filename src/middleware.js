import { NextRequest } from "next/server";

export default function middleware(req) {
  console.log("middleware call", req.url);
}