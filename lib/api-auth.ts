import { NextRequest, NextResponse } from "next/server";

const VALID_API_KEYS = new Set([process.env.MASTER_API_KEY].filter(Boolean));

// Rate limiting storage (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minuto
};

export function validateApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false;
  return VALID_API_KEYS.has(apiKey);
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

export function logApiRequest(
  apiKey: string,
  endpoint: string,
  method: string,
  ip: string,
  success: boolean
) {
  const timestamp = new Date().toISOString();
  const maskedKey = `${apiKey.substring(0, 8)}...`;
  console.log(
    `[API-LOG] ${timestamp} | ${method} ${endpoint} | Key: ${maskedKey} | IP: ${ip} | Success: ${success}`
  );
}

export interface ApiAuthResult {
  success: boolean;
  error?: string;
  status?: number;
  apiKey?: string;
}

export function authenticateApiRequest(request: NextRequest): ApiAuthResult {
  // Extraer API Key del header Authorization o x-api-key
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  let apiKey: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    apiKey = authHeader.substring(7);
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader;
  }

  // Validar que existe API Key
  if (!apiKey) {
    return {
      success: false,
      error:
        "API Key requerida. Incluya 'Authorization: Bearer YOUR_KEY' o 'x-api-key: YOUR_KEY' en los headers",
      status: 401,
    };
  }

  // Validar API Key
  if (!validateApiKey(apiKey)) {
    return {
      success: false,
      error: "API Key inválida",
      status: 403,
    };
  }

  // Obtener IP del cliente
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limiting
  const rateLimitResult = checkRateLimit(`${apiKey}:${ip}`);

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Rate limit excedido. Intente nuevamente más tarde",
      status: 429,
    };
  }

  return {
    success: true,
    apiKey,
  };
}

export async function generateApiKey(): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // Generar clave usando Web Crypto API
    const uuid1 = crypto.randomUUID().replace(/-/g, "");
    const uuid2 = crypto.randomUUID().replace(/-/g, "");
    return `sk_${uuid1}${uuid2}`;
  } else {
    // Fallback para ambientes sin crypto
    const randomString = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    return `sk_${randomString}`;
  }
}

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function createApiResponse(
  data: any,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return addCorsHeaders(response);
}

export function createApiErrorResponse(
  error: string,
  status: number = 500
): NextResponse {
  const response = NextResponse.json({ error, success: false }, { status });
  return addCorsHeaders(response);
}
