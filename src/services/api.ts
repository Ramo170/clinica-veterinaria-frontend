const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

let cleanUrl = rawUrl;
while (cleanUrl.endsWith('/')) {
  cleanUrl = cleanUrl.slice(0, -1);
}

const BASE_URL = cleanUrl;

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const response = await fetch(`${BASE_URL}${formattedEndpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ${response.status}: Falha ao comunicar com o servidor`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}