import { NextApiRequest, NextApiResponse } from "next";
import setLoggedIn from "./setLoggedIn";
import setLoggedOut from "./setLoggedOut";
import regenerateStaticPage from "./revalidate";
import enablePreviewMode from "./enablePreviewMode";
import exitPreviewMode from "./exitPreviewMode";
import validateRouteSecretToken from "./validateRouteSecretToken";
import verifyUserAuthStatus from "./verifyUserAuthStatus";

export function withSecretValidation(req, res, callback) {
  const { error } = validateRouteSecretToken(req, res);
  return error ?? callback(req, res);
}

export default function apiRouter(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const slug = req.query.route;

  switch (slug[0]) {
    case "is-authenticated":
      return verifyUserAuthStatus(req, res);
    case "revalidate":
      return withSecretValidation(req, res, regenerateStaticPage);
    case "preview":
      return withSecretValidation(req, res, enablePreviewMode);
    case "exit-preview":
      return exitPreviewMode(req, res);
    default:
      res.statusCode = 404;
      res.end();
  }
}
