// vite.config.js
import ViteRestart from 'vite-plugin-restart'

export default {
  plugins: [
    ViteRestart({
      restart: [
        'vite.config.[jt]s',
      ]
    })
  ],
}