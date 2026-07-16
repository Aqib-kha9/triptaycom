import { NextResponse } from "next/server";

// PayU redirects the user's browser here with POST data after a successful payment.
// We store the PayU response in a cookie and redirect to the client-side callback page
// which will call the backend verify API.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payuResponse: Record<string, string> = {};
    formData.forEach((value, key) => {
      payuResponse[key] = String(value);
    });

    // Store the PayU response in a short-lived cookie for the callback page to read
    const response = NextResponse.redirect(new URL("/checkout/payu/callback?status=success", request.url));
    response.cookies.set("payu_response", JSON.stringify(payuResponse), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 300, // 5 minutes
      path: "/",
    });
    return response;
  } catch (error) {
    // If parsing fails, redirect to failure page
    return NextResponse.redirect(new URL("/checkout/failure", request.url));
  }
}

// Handle GET requests (some PayU configurations may use GET redirect)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payuResponse: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      payuResponse[key] = value;
    });

    const response = NextResponse.redirect(new URL("/checkout/payu/callback?status=success", request.url));
    response.cookies.set("payu_response", JSON.stringify(payuResponse), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 300,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/checkout/failure", request.url));
  }
}
