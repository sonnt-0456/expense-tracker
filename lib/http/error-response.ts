import { NextResponse } from 'next/server';

type ErrorDetails = Record<string, string[]>;

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: ErrorDetails
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    },
    { status }
  );
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : undefined;
}

export function getErrorCode(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}
