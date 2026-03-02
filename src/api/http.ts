const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function http<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const fullUrl = `${API_BASE_URL}${url}`;

    const res = await fetch(fullUrl, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Request failed");
    }

    // Handle empty responses (like 204 No Content)
    if (res.status === 204) {
        return {} as T;
    }

    return res.json() as Promise<T>;
}
