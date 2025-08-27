
export type LoginPayload = { username: string; password: string };
export type LoginResponse = { accessToken: string };


export async function loginApi(payload: LoginPayload): Promise<string> {
    // DummyJSON fake login endpoint
    const res = await fetch('https://dummyjson.com/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });


    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Login failed');
    }


    const data = (await res.json()) as LoginResponse;
    return data.accessToken;
}