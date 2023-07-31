import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';

import { getTeams } from '@/app/api/team/model';

export default authMiddleware({
  publicRoutes: ['/'],
  async afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // redirect them to team overview page
    if (auth.userId && req.nextUrl.pathname === "/") {
      const teams = await getTeams(auth.userId)

      const { origin } = req.nextUrl
      // if (teams.length === 0) {
      //   return NextResponse.redirect(origin + `/team/create`)
      // }
      // return NextResponse.redirect(origin + `/${teams[0].slug}`)
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
