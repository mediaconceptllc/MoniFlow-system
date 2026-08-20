import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tickets-BqGqAz2_.js
var listTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("b61348dc23762ecf02e063adec8050abec82e2d3e61aaa0e81182297421bbaf2"));
var getTicket = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("ab79cf1792122f2cee831af29379027bf470908cc5acae1a161acf91c6069acd"));
var createTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2d8f9877b4fa263420558aaa2fc5c95331d33699613bb730a784825e04d7ba54"));
var transitionTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("67e128e501271abd198324f4faebf0bf092e7816d6b45450b95b6b06230cfa59"));
var addTicketComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("7c0443e8e11e38aa99cfa7c80ef1f927a3a039c8620051376c2297128676b8d5"));
var assignTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e511c90e28b04d50b166596aee252253d3892b1806ddb810922bf1ba297199b5"));
var escalateTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("531a89c0bf61627ce48abf63e835d46613416d270855c4f6a1ffb4b5d6b77e9c"));
//#endregion
export { getTicket as a, escalateTicket as i, assignTicket as n, listTickets as o, createTicket as r, transitionTicket as s, addTicketComment as t };
