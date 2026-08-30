import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

/** The root path is a router only: signed-in users go to the editor, everyone else signs in. */
export default async function Home() {
  const { userId } = await auth();

  redirect(userId ? "/editor" : "/sign-in");
}
