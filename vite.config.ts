import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleGenerateReviewRequest } from './src/server/generateReviewHandler'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/generate-review' && req.method === 'POST') {
              let bodyStr = ''
              req.on('data', (chunk) => {
                bodyStr += chunk
              })
              req.on('end', async () => {
                try {
                  const body = bodyStr ? JSON.parse(bodyStr) : {}
                  const result = await handleGenerateReviewRequest(body, env)
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(result))
                } catch (e: unknown) {
                  const msg = e instanceof Error ? e.message : 'Internal Server Error'
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ success: false, error: msg }))
                }
              })
              return
            }
            next()
          })
        },
      },
    ],
    server: {
      port: 5173,
      host: true,
    },
  }
})
