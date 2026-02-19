/**
 * Custom error class for all MailCatapulte API errors.
 *
 * @example
 * ```ts
 * try {
 *   await client.emails.send({ ... });
 * } catch (err) {
 *   if (err instanceof MailCatapulteError) {
 *     console.error(err.statusCode, err.type, err.message);
 *   }
 * }
 * ```
 */
export class MailCatapulteError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly code?: string;

  constructor(
    statusCode: number,
    type: string,
    message: string,
    code?: string,
  ) {
    super(message);
    this.name = "MailCatapulteError";
    this.statusCode = statusCode;
    this.type = type;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
