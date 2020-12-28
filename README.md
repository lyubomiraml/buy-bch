# Buy BCH for BGN Frontend Application

## Prerequisets for local development

yarn or npm

### Local Development

1. npm install or yarn
2. npm run start or yarn start

### Build a new version

You can configure runtime variables defined in .env (.env for dev; .env.staging for staging; .env.production for production):

    REACT_APP_TERMS_AND_CONDITIONS_URL -> Terms and conditions URL
    REACT_APP_EXCHANGE_RATE_TERMS_URL -> Terms and conditions for exchange rate recalculation URL
    REACT_APP_BACKEND_URL -> URL of backend buy-bch api

In order to build a new version of the app you should:

1. npm install or yarn
2. npm run build or yarn build (build:staging for staging build:production for production)
3. Compiled static assets are in /build folder and can be served by any web server(node, apache, nginx)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

A new version of the application can be deployed to Github Pages via:

    ```shell
    yarn deploy
    ```

## Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

## Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
