import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Paths that may be reached without a session. Everything else is protected.
 *
 * The auth paths come from the Clerk sign-in/sign-up env vars so the public
 * surface and the pages Clerk redirects to can never drift apart.
 */
const publicPaths = [
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
].filter((path): path is string => Boolean(path));

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default clerkMiddleware(async (auth, request) => {
  if (isPublicPath(request.nextUrl.pathname)) {
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
