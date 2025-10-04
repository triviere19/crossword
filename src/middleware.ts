/** 
 * @page middleware.ts 
 * middleware for next-auth
 */

import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/admin" // Redirect to custom login page
    }
});

export const config = {
    matcher: ["/admin/home", "/admin/generator"] // Only protect this specified routes
}