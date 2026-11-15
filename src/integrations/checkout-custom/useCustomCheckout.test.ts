import {
  describe,
  it,
  expect,
  mock,
  jest,
  beforeEach,
  afterEach,
} from "bun:test";

// No DOM/React renderer is available in this repo, so this is a minimal hook
// runtime: re-renders on state change, runs effects/subscriptions on mount.
type Cleanup = void | (() => void);
const hookRuntime = {
  slots: [] as any[],
  index: 0,
  pendingEffects: [] as Array<() => Cleanup>,
  cleanups: [] as Array<() => void>,
  rerender: () => {},
};

const realReact = require("react");

mock.module("react", () => {
  const nextSlot = <T>(
    init: () => T
  ): { slot: { value: T }; isNew: boolean } => {
    const i = hookRuntime.index++;
    const isNew = !(i in hookRuntime.slots);
    if (isNew) hookRuntime.slots[i] = { value: init() };
    return { slot: hookRuntime.slots[i], isNew };
  };
  const hooks = {
    useState<T>(initial: T) {
      const { slot } = nextSlot(() => initial);
      const set = (v: T) => {
        if (!Object.is(slot.value, v)) {
          slot.value = v;
          hookRuntime.rerender();
        }
      };
      return [slot.value, set];
    },
    useRef<T>(initial: T) {
      return nextSlot(() => ({ current: initial })).slot.value;
    },
    useCallback<T>(fn: T) {
      return fn;
    },
    useEffect(effect: () => Cleanup) {
      const { isNew } = nextSlot(() => null);
      if (isNew) hookRuntime.pendingEffects.push(effect);
    },
    useSyncExternalStore<T>(
      subscribe: (cb: () => void) => () => void,
      getSnapshot: () => T
    ) {
      const { isNew } = nextSlot(() => null);
      if (isNew) {
        hookRuntime.pendingEffects.push(() =>
          subscribe(() => hookRuntime.rerender())
        );
      }
      return getSnapshot();
    },
  };
  const merged = { ...realReact, ...hooks };
  return { ...merged, default: merged };
});

mock.module("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
}));

const realCart = await import("@shopkit/cart");

mock.module("@shopkit/cart", () => ({
  ...realCart,
  useCartStore: () => ({
    items: [{ id: "line_1", price: 49900, quantity: 1 }],
    cartToken: "cart_token",
    checkoutUrl: "",
    clearCart: () => {},
    closeCart: () => {},
  }),
}));

function renderHook<T>(hook: () => T) {
  const result = { current: undefined as T };
  const render = () => {
    hookRuntime.index = 0;
    result.current = hook();
    const effects = hookRuntime.pendingEffects.splice(0);
    for (const effect of effects) {
      const cleanup = effect();
      if (typeof cleanup === "function") hookRuntime.cleanups.push(cleanup);
    }
  };
  hookRuntime.rerender = render;
  render();
  return {
    result,
    unmount: () => hookRuntime.cleanups.splice(0).forEach((c) => c()),
  };
}

/** Simulates gokwik.js finishing and <CheckoutScriptCustom onReady> firing. */
function loadGokwikScript() {
  (window as any).gokwikSdk = { initCheckout: () => {}, on: () => {} };
  notifyGokwikScriptReady?.();
}

const { useCustomCheckout } = await import("./useCustomCheckout");
const { notifyGokwikScriptReady } =
  (await import("./CustomCheckoutService")) as any;
const { default: CheckoutScriptCustom } =
  await import("./CheckoutScriptCustom");
const { CheckoutButtonCustom } = await import("./CheckoutButtonCustom");
const { BuyNowButtonCustom } = await import("./BuyNowButtonCustom");

function findButton(node: any): any {
  if (!node || typeof node !== "object") return null;
  if (node.type === "button") return node;
  const children = [node.props?.children].flat();
  for (const child of children) {
    const found = findButton(child);
    if (found) return found;
  }
  return null;
}

describe("useCustomCheckout isGokwikAvailable", () => {
  let unmount: () => void = () => {};

  beforeEach(() => {
    hookRuntime.slots = [];
    hookRuntime.pendingEffects = [];
    hookRuntime.cleanups = [];
    (globalThis as any).window = new EventTarget();
    jest.useFakeTimers();
  });

  afterEach(() => {
    unmount();
    jest.useRealTimers();
    delete (globalThis as any).window;
  });

  it("is true immediately when the SDK is already on window", () => {
    (window as any).gokwikSdk = { initCheckout: () => {}, on: () => {} };
    const r = renderHook(() => useCustomCheckout());
    unmount = r.unmount;
    expect(r.result.current.isGokwikAvailable).toBe(true);
  });

  it("becomes true when the script loads after 6s on a slow (3G) network", () => {
    const r = renderHook(() => useCustomCheckout());
    unmount = r.unmount;
    expect(r.result.current.isGokwikAvailable).toBe(false);

    jest.advanceTimersByTime(6000);
    loadGokwikScript();

    expect(r.result.current.isGokwikAvailable).toBe(true);
  });

  it("stays false while the script has not loaded and schedules no timers", () => {
    const r = renderHook(() => useCustomCheckout());
    unmount = r.unmount;
    expect(jest.getTimerCount()).toBe(0);
    jest.advanceTimersByTime(60_000);
    expect(r.result.current.isGokwikAvailable).toBe(false);
  });

  it("unsubscribes on unmount so a later script load does not re-render", () => {
    let renders = 0;
    const r = renderHook(() => {
      renders++;
      return useCustomCheckout();
    });
    r.unmount();
    const rendersAtUnmount = renders;

    loadGokwikScript();

    expect(renders).toBe(rendersAtUnmount);
  });
});

describe("CheckoutScriptCustom", () => {
  it("loads gokwik.js from the configured GoKwik script host, the URL the layout preloads", async () => {
    const { getGokwikScriptUrl } = await import("./config");
    const previous = process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL;
    process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL = "https://pdp.gokwik.test";
    try {
      const script = CheckoutScriptCustom({}) as any;

      expect(script.props.src).toBe(
        "https://pdp.gokwik.test/v4/build/gokwik.js"
      );
      expect(getGokwikScriptUrl()).toBe(script.props.src);
    } finally {
      process.env.NEXT_PUBLIC_GOKWIK_SCRIPT_URL = previous;
    }
  });

  it("logs a failed load when the layout's <Script> started the download", () => {
    // next/script fires onLoad (never onError) on instances that join an
    // in-flight load, even when that load failed.
    (globalThis as any).window = new EventTarget();
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const script = CheckoutScriptCustom({}) as any;

    script.props.onLoad();

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError.mock.calls[0][0]).toBe("GoKwik script failed to load");
    consoleError.mockRestore();
    delete (globalThis as any).window;
  });

  it("does not log when the SDK arrived", () => {
    (globalThis as any).window = new EventTarget();
    (window as any).gokwikSdk = { initCheckout: () => {}, on: () => {} };
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const script = CheckoutScriptCustom({}) as any;

    script.props.onLoad();

    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
    delete (globalThis as any).window;
  });

  it("logs a gokwik.js load failure", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const script = CheckoutScriptCustom({}) as any;
    const event = new Event("error");

    script.props.onError?.(event);

    expect(consoleError).toHaveBeenCalledWith(
      "GoKwik script failed to load",
      event
    );
    consoleError.mockRestore();
  });
});

describe("CheckoutButtonCustom loading state", () => {
  let unmount: () => void = () => {};

  beforeEach(() => {
    hookRuntime.slots = [];
    hookRuntime.pendingEffects = [];
    hookRuntime.cleanups = [];
    (globalThis as any).window = new EventTarget();
  });

  afterEach(() => {
    unmount();
    delete (globalThis as any).window;
  });

  it("is disabled with disabled styling and a loader left of its label until the script loads", () => {
    const r = renderHook(() => CheckoutButtonCustom({ children: "Checkout" }));
    unmount = r.unmount;

    const button = findButton(r.result.current);
    const content = [button.props.children].flat();
    expect(button.props.disabled).toBe(true);
    expect(button.props["aria-busy"]).toBe(true);
    expect(button.props.className).toContain("disabled:cursor-not-allowed");
    expect(content[0]?.props?.["aria-label"]).toBe("Loading checkout");
    expect(content[1]).toBe("Checkout");
  });

  it("enables and drops the loader once the script loads", () => {
    const r = renderHook(() => CheckoutButtonCustom({ children: "Checkout" }));
    unmount = r.unmount;

    loadGokwikScript();

    const button = findButton(r.result.current);
    const content = [button.props.children].flat().filter(Boolean);
    expect(button.props.disabled).toBe(false);
    expect(button.props["aria-busy"]).toBe(false);
    expect(content).toEqual(["Checkout"]);
  });
});

describe("BuyNowButtonCustom loading state", () => {
  let unmount: () => void = () => {};
  const renderBuyNow = () =>
    renderHook(() =>
      BuyNowButtonCustom({
        children: "Buy Now",
        variantId: "variant_1",
        productId: "product_1",
        title: "Shampoo",
        price: { amount: 49900, currencyCode: "INR" },
        quantity: 1,
      } as any)
    );

  beforeEach(() => {
    hookRuntime.slots = [];
    hookRuntime.pendingEffects = [];
    hookRuntime.cleanups = [];
    (globalThis as any).window = new EventTarget();
  });

  afterEach(() => {
    unmount();
    delete (globalThis as any).window;
  });

  it("is disabled with disabled styling and a loader left of its label until the script loads", () => {
    const r = renderBuyNow();
    unmount = r.unmount;

    const button = findButton(r.result.current);
    const content = [button.props.children].flat();
    expect(button.props.disabled).toBe(true);
    expect(button.props["aria-busy"]).toBe(true);
    expect(button.props.className).toContain("disabled:cursor-not-allowed");
    expect(content[0]?.props?.["aria-label"]).toBe("Loading checkout");
    expect(content[1]).toBe("Buy Now");
  });

  it("enables once the SDK is ready even if its own <Script> onReady never fired", () => {
    const r = renderBuyNow();
    unmount = r.unmount;

    loadGokwikScript();

    const button = findButton(r.result.current);
    const content = [button.props.children].flat().filter(Boolean);
    expect(button.props.disabled).toBe(false);
    expect(button.props["aria-busy"]).toBe(false);
    expect(content).toEqual(["Buy Now"]);
  });
});
