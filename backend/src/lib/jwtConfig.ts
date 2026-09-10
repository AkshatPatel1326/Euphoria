import "dotenv/config";

const MIN_SECRET_LENGTH = 32;

/**
 * Returns the configured JWT secret key from environment variables.
 * Enforces strict cryptographic length (minimum 32 characters) across all environments.
 * Eliminates insecure fallbacks and hardcoded secrets.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "FATAL SECURITY ERROR: JWT_SECRET environment variable is missing. A secure, cryptographic secret (min 32 characters) must be defined in .env."
    );
  }

  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `FATAL SECURITY ERROR: JWT_SECRET is too short (${secret.length} chars). A minimum of ${MIN_SECRET_LENGTH} characters is required for HMAC-SHA256 security.`
    );
  }

  return secret;
}
