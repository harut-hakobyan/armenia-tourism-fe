const tokenKey = 'amt.auth.token'

export const authStorage = {
  get: (): string | null => typeof window === 'undefined' ? null : localStorage.getItem(tokenKey),
  set: (token: string): void => { if (typeof window !== 'undefined') localStorage.setItem(tokenKey, token) },
  clear: (): void => { if (typeof window !== 'undefined') localStorage.removeItem(tokenKey) },
}
