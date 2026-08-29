/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_DEV_ALLOWED_HOSTS?: string
  readonly VITE_DEV_API_PROXY_TARGET?: string
  readonly VITE_NGROK_SKIP_BROWSER_WARNING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
