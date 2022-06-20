/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */

 import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
 import { configSchema } from "./config-schema";
 
 /**
  * This tells the app shell how to obtain translation files: that they
  * are JSON files in the directory `../translations` (which you should
  * see in the directory structure).
  */
 const importTranslation = require.context(
   "../translations",
   false,
   /.json$/,
   "lazy"
 );
 
 
 /**
  * This function performs any setup that should happen at microfrontend
  * load-time (such as defining the config schema) and then returns an
  * object which describes how the React application(s) should be
  * rendered.
  *
  * In this example, our return object contains a single page definition.
  * It tells the app shell that the default export of `greeter.tsx`
  * should be rendered when the route matches `hello`. The full route
  * will be `openmrsSpaBase() + 'hello'`, which is usually
  * `/openmrs/spa/hello`.
  */
 function setupOpenMRS() {
   const moduleName = "@mhiseg/esm-registration-app";
 
   const options = {
     featureName: "add-patient",
     moduleName,
   };
 
   defineConfigSchema(moduleName, configSchema);
 
   return {
     pages: [
       {
         load: getAsyncLifecycle(() => import("./root.component"), options),
         route: "death",
         privilege: "App: death.management"
       },
     ]
   };
 }
 
 export {importTranslation, setupOpenMRS };
 