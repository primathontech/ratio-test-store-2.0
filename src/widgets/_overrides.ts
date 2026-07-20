/**
 * Local logic-override registry (customization ladder rung 5).
 *
 * STARTER: always empty — this file exists so section dispatchers can resolve
 * through it unconditionally.
 *
 * MERCHANT FORK: register a decorating wrapper per section, e.g.
 *
 *   // widgets/local/CollectionGrid/logic.ts
 *   import { buildCollectionGridVM } from "@/widgets/common/CollectionGrid/logic";
 *   export const buildVM: typeof buildCollectionGridVM = (data, settings) => {
 *     const vm = buildCollectionGridVM(data, settings);
 *     return { ...vm, shared: { ...vm.shared, onAddToCart: async (item, opts) => {
 *       await merchantSideEffect(item);
 *       return vm.shared.onAddToCart(item, { ...opts, source: "plp" });
 *     } } };
 *   };
 *
 *   // then here:
 *   import { buildVM as heroLocal } from "@/widgets/local/Hero/logic";
 *   export const LOCAL_LOGIC = { Hero: heroLocal };
 *
 * One wrapper covers ALL variants of the section (logic is shared).
 * common/ stays untouched — the read-only guard does not apply to local/.
 */
export const LOCAL_LOGIC: Record<string, unknown> = {};
