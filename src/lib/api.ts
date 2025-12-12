const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API URL configured as:', API_URL);

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        console.log('ApiClient initialized with baseUrl:', this.baseUrl);
    }

    private getAuthHeader(): HeadersInit {
        const token = localStorage.getItem('auth_token');
        if (token) {
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
        return {
            'Content-Type': 'application/json',
        };
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        console.log('POST request to:', url);
        console.log('Request data:', data);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getAuthHeader(),
                body: data ? JSON.stringify(data) : undefined,
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Request failed' }));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Fetch error details:', error);
            throw error;
        }
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getAuthHeader(),
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async delete<T>(endpoint: string): Promise<T | void> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return;
        }

        return response.json();
    }
}

export const api = new ApiClient(API_URL);
