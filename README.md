# Atlas PME — Backend Gmail

Proxy Netlify Functions pour connecter Atlas PME à Gmail via OAuth 2.0.

## Structure
```
netlify/
  functions/
    gmail.js     ← fonction serverless
netlify.toml     ← config Netlify
```

## Variables d'environnement à configurer sur Netlify

Dans Netlify → Site settings → Environment variables, ajoutez :

| Variable | Valeur |
|---|---|
| `GMAIL_CLIENT_ID` | Votre Client ID Google |
| `GMAIL_CLIENT_SECRET` | Votre Client Secret Google |
| `GMAIL_REFRESH_TOKEN` | Votre Refresh Token |

## Endpoint disponible

`GET /.netlify/functions/gmail` → retourne les 25 derniers emails au format JSON
`GET /.netlify/functions/gmail?max=50` → retourne 50 emails
