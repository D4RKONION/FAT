type PremiumReducerAction = {
  type: "SET_LIFETIME_PREMIUM_PURCHASED" | "RESET_PREMIUM" | "SET_APP_OPEN_COUNT";
  appFirstOpened: number;
  appOpenCount: number;
};

const defaultState = {
  lifetimePremiumPurchased: false,
  appFirstOpened: new Date().getTime(),
  appOpenCount: 0,
};

export const premiumReducer = (state = defaultState, action: PremiumReducerAction) => {
  switch (action.type) {
    case "SET_LIFETIME_PREMIUM_PURCHASED":
      return {
        ...state,
        lifetimePremiumPurchased: true,
      };
    case "SET_APP_OPEN_COUNT":
      return {
        ...state,
        appOpenCount: action.appOpenCount,
      };
    case "RESET_PREMIUM":
      return {
        ...state,
        lifetimePremiumPurchased: false,
      };
    default:
      return state;
  }
};
