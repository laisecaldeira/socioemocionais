export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/checkout/:path*', '/onboarding/:path*', '/intake/:path*', '/loading/:path*', '/result/:path*', '/admin/:path*']
};
