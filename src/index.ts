 import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
 import { configSchema } from "./config-schema";

 const importTranslation = require.context(
   "../translations",
   false,
   /.json$/,
   "lazy"
 );
 
 
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
 