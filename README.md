# ThriftScan

Expo React Native MVP for vintage clothing resellers.

## Run

```bash
npm install
npm run web
```

## AI appraisal

The app runs with a mock appraisal by default. To use a real Vision call, set either:

- `EXPO_PUBLIC_AI_ENDPOINT` to a backend/proxy that accepts `{ garment, tag, prompt }`
- `EXPO_PUBLIC_OPENAI_API_KEY` for local prototype calls to the OpenAI Responses API

For production, use a backend proxy. Public Expo variables are bundled into the client.
