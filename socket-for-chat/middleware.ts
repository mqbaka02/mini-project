import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const url= request.nextUrl.clone();

    if(url.pathname.startsWith('/admin')) {
        const token= request.cookies.get('adminToken')?.value;
        console.log("ADMIN TOKEN====" + token);

        if(!token) {
            url.pathname= '/profile';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config= {
    matcher: ['/admin/:path*'],
};