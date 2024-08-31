
// import { Theme } from '@radix-ui/themes';
// import { useMainStore } from './store/main';
// import App from './root';


// const AppWithTheme = () => {
 
//   return <Theme appearance={useMainStore.getState().isDarkMode ? 'dark' : 'light'}>
//     <App />
//   </Theme>;

// };

// export default AppWithTheme;

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document.querySelector('#app') as Element,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});