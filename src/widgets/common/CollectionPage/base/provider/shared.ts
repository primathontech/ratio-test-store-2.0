import {
  IActionFeedback,
  IFeedback,
  IActionMessage,
  TAction,
  TActionStateRecord,
  ProviderState,
} from "./type";

/**
 * Centralized feedback implementation factory
 */
export const createFeedbackImplementation = (
  getActionState: () => TActionStateRecord,
  getState: () => ProviderState
): IFeedback => ({
  isIdle: (type: TAction) => getActionState()[type]?.state === "IDLE",
  isLoading: (type: TAction) => getActionState()[type]?.state === "LOADING",
  isSuccess: (type: TAction) => getActionState()[type]?.state === "SUCCESS",
  isError: (type: TAction) => getActionState()[type]?.state === "ERROR",

  getMessage: (type: TAction): IActionMessage => {
    const state = getActionState()[type];
    return {
      state: state.state,
      message: state?.message,
    };
  },

  getFeedback: (type: TAction): IActionFeedback => {
    const state = getActionState()[type];
    return {
      state: state.state,
      message: state?.message,
      error: state?.error,
      data: state?.data,
      timestamp: state?.timestamp,
    };
  },

  getState: () => getState(),
});

/**
 * Default action state for fallback scenarios
 */
export const createDefaultActionState = (): TActionStateRecord => ({
  FILTER: { state: "IDLE", data: null, timestamp: Date.now() },
  SORT: { state: "IDLE", data: null, timestamp: Date.now() },
  CLEAR_ALL_FILTERS: { state: "IDLE", data: null, timestamp: Date.now() },
  LOAD_MORE: { state: "IDLE", data: null, timestamp: Date.now() },
  LOAD_COLLECTION: { state: "IDLE", data: null, timestamp: Date.now() },
  LOAD_FILTERS: { state: "IDLE", data: null, timestamp: Date.now() },
});
