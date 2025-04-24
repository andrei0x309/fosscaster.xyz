
// import { Theme } from '@radix-ui/themes';
// import { useMainStore } from './store/main';
// import App from './root';


// const AppWithTheme = () => {
 
//   return <Theme appearance={useMainStore.getState().isDarkMode ? 'dark' : 'light'}>
//     <App />
//   </Theme>;

// };

// export default AppWithTheme;

import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";


startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter/>
    </StrictMode>
  );
});