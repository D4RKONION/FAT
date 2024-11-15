type PremiumReducerAction = {
  type: 'SET_LIFETIME_PREMIUM_PURCHASED' | 'RESET_PREMIUM';
}

const defaultState = {
  lifetimePremiumPurchased: false,
};

export const premiumReducer = (state = defaultState, action: PremiumReducerAction) => {
  switch(action.type) {
    case 'SET_LIFETIME_PREMIUM_PURCHASED':
      return {
        ...state,
        lifetimePremiumPurchased: true
      }
    case 'RESET_PREMIUM':
      return {
        ...state,
        lifetimePremiumPurchased: false
      }
    default:
      return state;
  }
}
