const tokenKey = 'amt.auth.token'

export const authStorage = {
  get: (): string | null => localStorage.getItem(tokenKey),
  set: (token: string): void => localStorage.setItem(tokenKey, token),
  clear: (): void => localStorage.removeItem(tokenKey),
}
