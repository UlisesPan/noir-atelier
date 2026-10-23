import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `true` solo en el cliente después de hidratar. Evita mismatches con estado de localStorage. */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
