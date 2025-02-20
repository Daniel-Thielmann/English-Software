export function formatDate(date) {
  const dateUTC = new Date(date); // Cria um objeto Date a partir da data UTC
  const dateBRT = new Date(dateUTC.getTime() + 3 * 60 * 60 * 1000); // Adiciona 3 horas em milissegundos
  return dateBRT.toLocaleDateString("pt-BR");
}

export function formatEntryDate(entryDate) {
  const date = new Date(entryDate);

  return date.toLocaleDateString("pt-BR");
}
