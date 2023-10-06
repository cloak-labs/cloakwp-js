const AUTH_SECRET = process.env.CLOAKWP_AUTH_SECRET;

export default function validateRouteSecretToken(req, res) {
  const { secret } = req.query;

  // Check the secret ENV variable has been set
  if (!AUTH_SECRET) {
    return {
      error: res.status(401).json({
        error:
          "Cannot verify access because you haven't set a CLOAKWP_AUTH_SECRET environment variable.",
      }),
    };
  }

  // Check the supplied secret matches the corresponding ENV variable
  if (secret !== AUTH_SECRET) {
    return {
      error: res.status(401).json({
        error:
          'Access denied: invalid secret token. You must pass in a secret token via a "secret" URL parameter that matches your environment variable "CLOAKWP_AUTH_SECRET"',
      }),
    };
  }

  return { valid: true };
}
