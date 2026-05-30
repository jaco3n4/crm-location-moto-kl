import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './'  ->  chemins relatifs : le build fonctionne quel que soit
// le nom du dépôt GitHub Pages (jaco3n4.github.io/<n-importe-quel-repo>/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
