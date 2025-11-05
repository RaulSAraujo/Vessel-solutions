import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from "#supabase/server";
import type { H3Event } from "h3";
import type { Database } from "../types/database";

/**
 * Obtém o cliente Supabase e o usuário autenticado para uma rota Nitro.
 * Lança um erro 401 se o usuário não estiver autenticado.
 */
export async function getSupabaseClientAndUser(event: H3Event) {
  const client = await serverSupabaseClient<Database>(event);
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Authentication required. Please log in.",
    });
  }

  // No v2, o ID do usuário está em user.sub (JWT claims)
  // Criamos um objeto compatível com o formato anterior
  const userWithId = {
    ...user,
    id: user.sub // user.sub contém o ID do usuário nas JWT claims
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
