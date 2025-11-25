import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "./authTypes";

const API_BASE = "http://localhost:8080/v1/api/auth";

export async function loginApi(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("Nieudane logowanie");
    return response.json();
}

export async function registerApi(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error("Błąd rejestracji");
    return response.json();
}

