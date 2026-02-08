/// <reference types="vite/client" />

/**
 * Declares the structure of environment variables accessed via import.meta.env.
 * This resolves the TS2339 error for 'env' property missing on 'ImportMeta'.
 */
interface ImportMetaEnv {
  // IMPORTANT: This key must match the variable name you set in Vercel
  // e.g., 'VITE_API_BASE_URL'
  readonly VITE_API_BASE_URL: string; 
  
  // Add other environment variables (e.g., VITE_FIREBASE_KEY) here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
