import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-ElitWSjz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-Bx14KpU3.js
var listWorkItems = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((data) => data ?? {}).handler(createSsrRpc("f6f5465650c19bfe0d62f0daac0b58af1c89aec2821f26150380d78caf96f30b"));
var getWorkItem = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("1181b3bed496955d548b8ef85cf695163ba779df52db5559cc91590f9e303b63"));
var createWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("cf39959937e6b4d114f65eda1be59f6af9a298bf4f9f4c9f88bbac14353f8a4d"));
var updateWorkItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("85d6bf47ffc9cc976827d28286681ecb9acb72a06d895f7e1a6b6631e4681d4c"));
var transitionWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2a26880f47744d6cf41edee5cf3b23a17d58c2b623badee851e2fccc47aff30e"));
var addWorkComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("4af3d926d967168f2068498aac723e756f40343bb589edaa16422e3b0ca3355c"));
var recordDecision = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("a857dafc66c3fc78597c38493df40e22e9b56db8cf5fe61fae5d01f35534c801"));
var addTestRun = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("bd7cff161b3a2d002086ccb830c2fe5056e6719435a2c4ebf5f912646bb799bc"));
var listReleases = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6e9758e1c82595b3f74db093e812df6872dde54e42fba57887a432a083f676c0"));
//#endregion
export { listReleases as a, transitionWork as c, getWorkItem as i, updateWorkItem as l, addWorkComment as n, listWorkItems as o, createWorkItem as r, recordDecision as s, addTestRun as t };
