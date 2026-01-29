import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";
import type { H3Event } from "h3";
import type { Database } from "../types/database";

/** Usuário retornado pelas rotas de API (com id, email e user_metadata) */
export interface ServerAuthUser {
  id: string;
  sub: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Obtém o cliente Supabase e o usuário autenticado para uma rota Nitro.
 * Lança um erro 401 se o usuário não estiver autenticado.
 */
export async function getSupabaseClientAndUser(event: H3Event): Promise<{ client: Awaited<ReturnType<typeof serverSupabaseClient<Database>>>; user: ServerAuthUser }> {
  const client = await serverSupabaseClient<Database>(event);
  const jwtUser = await serverSupabaseUser(event);

  if (!jwtUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required. Please log in.",
    });
  }

  // Buscar usuário completo (com email, user_metadata) via auth.getUser (usa sessão da requisição)
  const { data: { user: fullUser } } = await client.auth.getUser();
  const user = fullUser ?? jwtUser;

  const userWithId: ServerAuthUser = {
    ...user,
    id: (user as { id?: string }).id ?? jwtUser.sub,
    sub: jwtUser.sub,
    email: (user as { email?: string }).email ?? undefined,
    user_metadata: (user as { user_metadata?: Record<string, unknown> }).user_metadata ?? {},
  };

  return { client, user: userWithId };
}

/**
 * Obtém apenas o cliente Supabase (sem verificar autenticação)
 */
export async function getSupabaseClient(event: H3Event) {
  return await serverSupabaseClient<Database>(event);
}

/**
 * Obtém o cliente Supabase com service role (para operações administrativas)
 */
export async function getSupabaseServiceRole(event: H3Event) {
  return await serverSupabaseServiceRole<Database>(event);
}
