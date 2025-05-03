/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER_URL?: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 