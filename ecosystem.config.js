module.exports = {
  apps: [
    {
      name: 'diapsa-frontend',
      cwd: '/home/grupod11/repo/diapsa-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3050 -H 127.0.0.1',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_BASE_URL: 'https://cms.grupodiapsa.com.mx/api/v1',
        NEXT_PUBLIC_API_TIMEOUT: '10000'
      }
    }
  ]
}
