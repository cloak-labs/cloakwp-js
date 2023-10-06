import { getWpInstance } from "../config";

export default async function verifyUserAuthStatus(req, res) {
  const wp = getWpInstance().serverApi();
  const wpCookie = req.headers.cookie || ""; // Get the WordPress cookies from the client-side request

  wp.setHeaders("Cookie", wpCookie);
  const isLoggedIn = await wp.isLoggedIn();

  res.json(isLoggedIn);
}
