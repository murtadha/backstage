import React, { FC } from 'react';
import {catalogApiRef, CatalogClient, plugin as CatalogPlugin} from '@backstage/plugin-catalog';
import {
  createApp,
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

const apis = () => {
  const builder = ApiRegistry.builder();
  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(featureFlagsApiRef, new FeatureFlags());

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: 'http://localhost:3000',
      basePath: '/catalog/api',
    }),
  );

  return builder.build();
}

const app = createApp({
  apis,
  plugins: [CatalogPlugin]
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const AppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AppRouter>
      <AppRoutes />
    </AppRouter>
  </AppProvider>
);

export default App;
