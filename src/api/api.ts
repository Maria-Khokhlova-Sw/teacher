const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = RequestInit & {
    json?: unknown;
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { json, headers, body, ...rest } = options;

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: {
            Accept: "application/json",
            ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: json !== undefined ? JSON.stringify(json) : body,
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data === "object") {
            throw data;
        }

        throw new Error(`Ошибка запроса: ${res.status}`);    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string, options?: ApiOptions) => request<T>(path, options),

    post: <T>(path: string, json?: unknown, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "POST", json }),

    put: <T>(path: string, json?: unknown, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "PUT", json }),

    patch: <T>(path: string, json?: unknown, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "PATCH", json }),

    delete: <T>(path: string, options?: ApiOptions) =>
        request<T>(path, { ...options, method: "DELETE" }),
};
