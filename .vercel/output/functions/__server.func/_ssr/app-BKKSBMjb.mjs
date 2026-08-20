import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-BKKSBMjb.js
var bootstrapApp = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("48506022df5ecdd5b28e31f31fb53a32ce50a7a10c01d40f0690104bd603eaa7"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("56bdddd1c2b6f84293d7c25444a9af3ac1880d884d55b6ccf52981d3a2a5b0aa"));
var listMembers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("109ce20833b38806936ab3977e6533d088e0f4304a5f7af617840dda5acb38e4"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e09254766e43aaeb20303496dff27a162fb1428c90dd7c67d55fe284f78dc7b6"));
var setMemberRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("dcd34e4b4af054047393499e6c561c7bd4b19cc90c46d90eb23ee58f2a0625b2"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d280f3eeaea155badd251a67bf5b7b88b775b39ad50d39775e76f4add9327719"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("36c23e2fea2db592f7bc7bc8fda8d934d6bf4335ec13c6edb2b55558482c37d8"));
var getKpis = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2cbf0128d5f82660ddf1d5e831f8c119f90521b19534a46c47dd466f89d34db0"));
//#endregion
export { listNotifications as a, listMembers as i, getKpis as n, markNotificationsRead as o, getMe as r, setMemberRole as s, bootstrapApp as t };
