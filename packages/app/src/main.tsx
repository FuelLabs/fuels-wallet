import { IS_CRX } from "./config";

if (IS_CRX) {
  import("./systems/CRX/portals/signup");
} else {
  import("./systems/WebApp/main");
}
