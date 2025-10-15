/**
 * Recalcula o total estimado de drinks para um evento com base nos parâmetros de perfil do Público, duração do evento e quantidade de convidados.
 * @param {string} audienceProfile - Perfil do Público (Casual, Premium ou Corporativo).
 * @param {string} startTime - Data e hora de início do evento no formato ISO 8601.
 * @param {string} endTime - Data e hora de término do evento no formato ISO 8601.
 * @param {number} guestCount - Quantidade de convidados para o evento.
 * @returns {Promise<number>} - O total estimado de drinks para o evento.
 */
export async function useCalculateEstimatedDrinkQuantity(audienceProfile: string, startTime: Date, endTime: Date, guestCount: number): Promise<number> {
  // Define os fatores de perfil do público
  const audienceProfileFactors: Record<string, number> = {
    Casual: 1.0,
    Premium: 1.5,
    Corporativo: 1.2,
  };

  const audienceProfileFactor = audienceProfileFactors[audienceProfile] || 1.0;

  // Calcula a duração do evento em horas
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const eventDurationHours = (end - start) / (1000 * 60 * 60); // Converte milissegundos para horas

  // Calcula o total estimado de drinks
  const estimated_total_drinks = guestCount * eventDurationHours * audienceProfileFactor;

  return Math.round(estimated_total_drinks);
}