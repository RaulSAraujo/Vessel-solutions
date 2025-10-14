import dayjs from 'dayjs';

/**
 * Formata uma data usando Day.js.
 * @param date A data a ser formatada (string, Date, ou objeto Day.js).
 * @param format O formato desejado (padrão: 'DD/MM/YYYY').
 * @returns A data formatada ou 'Data Inválida' se a data for inválida.
 */
export function formatDate(date: string | Date | dayjs.Dayjs | null | undefined, format = 'DD/MM/YYYY'): string {
  if (!date) {
    return '';
  }
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : 'Data Inválida';
}

/**
 * Converte uma data no formato brasileiro (DD/MM/YYYY HH:mm:ss) para o formato do banco de dados (YYYY-MM-DD HH:mm:ss).
 * @param date A data a ser formatada (string no formato brasileiro, Date, ou objeto Day.js).
 * @returns A data formatada no formato do banco de dados ou 'Data Inválida' se a entrada for inválida.
 */
export function formatDateTimeToDB(date: string | Date | dayjs.Dayjs | null | undefined): string {
  if (!date) {
    return '';
  }

  // Caso a data seja uma string no formato brasileiro (DD/MM/YYYY HH:mm:ss ou DD/MM/YYYY)
  if (typeof date === 'string' && date.includes('/')) {
    const [datePart, timePart] = date.split(' '); // Divide a parte da data e da hora
    const [day, month, year] = datePart!.split('/'); // Divide o dia, mês e ano

    if (day && month && year) {
      // Monta a data no formato ISO (YYYY-MM-DD)
      const formattedDate = `${year}-${month}-${day}`;

      // Adiciona a hora, se existir
      const formattedDateTime = timePart ? `${formattedDate}T${timePart}` : formattedDate;

      // Valida e formata usando Day.js
      const d = dayjs(formattedDateTime);
      return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : 'Data Inválida';
    }
    return 'Data Inválida';
  }

  // Caso seja um objeto Date ou Day.js
  const d = dayjs(date);
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : 'Data Inválida';
}

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * @param value O valor numérico a ser formatado.
 * @param locale O locale para formatação (padrão: 'pt-BR').
 * @param currency A moeda a ser utilizada (padrão: 'BRL').
 * @returns O valor formatado como string de moeda.
 */
export function formatCurrency(value: number | null | undefined, locale = 'pt-BR', currency = 'BRL'): string {
  if (value === null || value === undefined) {
    // Decida o que retornar para valores nulos/indefinidos.
    // Pode ser uma string vazia, 'R\$ 0,00', ou lançar um erro.
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

