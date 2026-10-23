export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** La API devuelve `message` como string o como array (errores de validación). */
export const extractMessage = (body: unknown, fallback = "Ocurrió un error inesperado") => {
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  return message || fallback;
};
