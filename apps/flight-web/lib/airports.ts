export interface AirportOption {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const AIRPORTS: AirportOption[] = [
  { code: "FLN", city: "Florianópolis", name: "Aeroporto Internacional Hercílio Luz", country: "Brasil" },
  { code: "GRU", city: "São Paulo", name: "Aeroporto Internacional de Guarulhos", country: "Brasil" },
  { code: "CGH", city: "São Paulo", name: "Aeroporto de Congonhas", country: "Brasil" },
  { code: "VCP", city: "Campinas", name: "Aeroporto Internacional de Viracopos", country: "Brasil" },
  { code: "GIG", city: "Rio de Janeiro", name: "Aeroporto Internacional Tom Jobim - Galeão", country: "Brasil" },
  { code: "SDU", city: "Rio de Janeiro", name: "Aeroporto Santos Dumont", country: "Brasil" },
  { code: "BSB", city: "Brasília", name: "Aeroporto Internacional de Brasília", country: "Brasil" },
  { code: "CNF", city: "Belo Horizonte", name: "Aeroporto Internacional de Confins", country: "Brasil" },
  { code: "CWB", city: "Curitiba", name: "Aeroporto Internacional Afonso Pena", country: "Brasil" },
  { code: "POA", city: "Porto Alegre", name: "Aeroporto Internacional Salgado Filho", country: "Brasil" },
  { code: "SSA", city: "Salvador", name: "Aeroporto Internacional de Salvador", country: "Brasil" },
  { code: "REC", city: "Recife", name: "Aeroporto Internacional dos Guararapes", country: "Brasil" },
  { code: "FOR", city: "Fortaleza", name: "Aeroporto Internacional Pinto Martins", country: "Brasil" },
  { code: "NAT", city: "Natal", name: "Aeroporto Internacional de Natal", country: "Brasil" },
  { code: "MCZ", city: "Maceió", name: "Aeroporto Internacional Zumbi dos Palmares", country: "Brasil" },
  { code: "BEL", city: "Belém", name: "Aeroporto Internacional de Belém", country: "Brasil" },
  { code: "MAO", city: "Manaus", name: "Aeroporto Internacional Eduardo Gomes", country: "Brasil" },
  { code: "LIS", city: "Lisboa", name: "Aeroporto Humberto Delgado", country: "Portugal" },
  { code: "OPO", city: "Porto", name: "Aeroporto Francisco Sá Carneiro", country: "Portugal" },
  { code: "MAD", city: "Madrid", name: "Aeroporto Adolfo Suárez Madrid-Barajas", country: "Espanha" },
  { code: "BCN", city: "Barcelona", name: "Aeroporto Josep Tarradellas Barcelona-El Prat", country: "Espanha" },
  { code: "CDG", city: "Paris", name: "Aeroporto Charles de Gaulle", country: "França" },
  { code: "ORY", city: "Paris", name: "Aeroporto de Paris-Orly", country: "França" },
  { code: "LHR", city: "Londres", name: "Aeroporto de Heathrow", country: "Reino Unido" },
  { code: "LGW", city: "Londres", name: "Aeroporto de Gatwick", country: "Reino Unido" },
  { code: "FCO", city: "Roma", name: "Aeroporto Leonardo da Vinci-Fiumicino", country: "Itália" },
  { code: "MIA", city: "Miami", name: "Miami International Airport", country: "Estados Unidos" },
  { code: "MCO", city: "Orlando", name: "Orlando International Airport", country: "Estados Unidos" },
  { code: "JFK", city: "Nova York", name: "John F. Kennedy International Airport", country: "Estados Unidos" },
  { code: "EWR", city: "Nova York", name: "Newark Liberty International Airport", country: "Estados Unidos" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International Airport", country: "Estados Unidos" },
  { code: "EZE", city: "Buenos Aires", name: "Aeroporto Internacional de Ezeiza", country: "Argentina" },
  { code: "AEP", city: "Buenos Aires", name: "Aeroparque Jorge Newbery", country: "Argentina" },
  { code: "SCL", city: "Santiago", name: "Aeroporto Internacional Arturo Merino Benítez", country: "Chile" }
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function searchAirports(query: string, limit = 8): AirportOption[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  return AIRPORTS.filter((airport) =>
    normalize(`${airport.code} ${airport.city} ${airport.name} ${airport.country}`).includes(q),
  ).slice(0, limit);
}
