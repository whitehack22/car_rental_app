import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux"
import { persistedStore, store } from './app/store.ts'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
    <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
