# CloakWP

Framework-neutral JavaScript APIs for connecting a decoupled frontend to
WordPress. Framework packages such as `@cloakwp/react` and `@cloakwp/nextjs`
build on these primitives.

## Install

```bash
npm install cloakwp
```

## Protocol modules

- `cloakwp/auth`: session cookie names, Application Password vs legacy JWT
  machine auth, and Web Crypto signing primitives
- `cloakwp/preview`: preview data and signed preview-token verification
- `cloakwp/revalidation`: signed revalidation request verification and handling
- `cloakwp/rest`: the native `Request`/`Response` CloakWP API handler
  (`preview`, `exit-preview`, `revalidate`, `auth/*`)

These modules use web-platform APIs and do not depend on React or Next.js.
