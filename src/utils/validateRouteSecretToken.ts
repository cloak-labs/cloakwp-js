const AUTH_SECRET = process.env.CLOAKWP_AUTH_SECRET;

export function validateRouteSecretToken(secret: string) {
  // Check the secret isn't null
  if (!secret) {
    return {
      error: "Access denied: a secret token was not provided.",
    };
  }

  // Check the secret ENV variable has been set
  if (!AUTH_SECRET) {
    return {
      error:
        "Access denied: cannot verify access because you haven't set a CLOAKWP_AUTH_SECRET environment variable.",
    };
  }

  // Check the supplied secret matches the corresponding ENV variable
  if (secret !== AUTH_SECRET) {
    return {
      error:
        'Access denied: invalid secret token. You must pass in a secret token via a "secret" URL parameter that matches your environment variable "CLOAKWP_AUTH_SECRET"',
    };
  }

  return { valid: true };
}
