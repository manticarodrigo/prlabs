import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';


export default authMiddleware({
  publicRoutes: ['/', '/privacy'],
  async afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // redirect them to team overview page
    if (auth.userId && req.nextUrl.pathname === "/") {

      const { origin } = req.nextUrl
      return NextResponse.redirect(origin + `/teams`)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
