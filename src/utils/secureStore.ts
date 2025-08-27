import EncryptedStorage from 'react-native-encrypted-storage';


const TOKEN_KEY = 'auth_token';


export async function saveToken(token: string) {
    await EncryptedStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({ token, savedAt: new Date().toISOString() })
    );
}


export async function getToken(): Promise<string | null> {
    const raw = await EncryptedStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed?.token ?? null;
    } catch {
        return null;
    }
}


export async function clearToken() {
    await EncryptedStorage.removeItem(TOKEN_KEY);
}