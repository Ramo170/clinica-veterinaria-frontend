const BASE_URL = 'http://localhost:8080/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T>{
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao comunicar com o servidor');
    }

    if(response.status === 204){
        return {} as T;
    }

    return response.json();
} 