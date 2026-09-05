import { createContext, useContext, useReducer, useEffect } from "react";

// Initial State
const initialState = {
  // Auth state
  auth: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
  },
  
  // Donations state
  donations: {
    currentDonation: null,
    donationHistory: [],
    loading: false,
    error: null,
  },
  
  // Notifications state
  notifications: [],
  
  // UI state
  ui: {
    donationModalOpen: false,
    paymentProcessing: false,
  },
};

// Action Types
export const ActionTypes = {
  // Auth
  SET_USER: "SET_USER",
  SET_TOKEN: "SET_TOKEN",
  LOGOUT: "LOGOUT",
  SET_AUTH_LOADING: "SET_AUTH_LOADING",
  
  // Donations
  SET_CURRENT_DONATION: "SET_CURRENT_DONATION",
  CLEAR_CURRENT_DONATION: "CLEAR_CURRENT_DONATION",
  ADD_DONATION_TO_HISTORY: "ADD_DONATION_TO_HISTORY",
  SET_DONATION_HISTORY: "SET_DONATION_HISTORY",
  SET_DONATION_LOADING: "SET_DONATION_LOADING",
  SET_DONATION_ERROR: "SET_DONATION_ERROR",
  UPDATE_DONATION_STATUS: "UPDATE_DONATION_STATUS",
  
  // Notifications
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",
  
  // UI
  OPEN_DONATION_MODAL: "OPEN_DONATION_MODAL",
  CLOSE_DONATION_MODAL: "CLOSE_DONATION_MODAL",
  SET_PAYMENT_PROCESSING: "SET_PAYMENT_PROCESSING",
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    // Auth actions
    case ActionTypes.SET_USER:
      return {
        ...state,
        auth: { ...state.auth, user: action.payload, isAuthenticated: true },
      };
    
    case ActionTypes.SET_TOKEN:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        auth: { ...state.auth, token: action.payload, isAuthenticated: true },
      };
    
    case ActionTypes.LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        auth: { user: null, token: null, isAuthenticated: false, loading: false },
      };
    
    case ActionTypes.SET_AUTH_LOADING:
      return {
        ...state,
        auth: { ...state.auth, loading: action.payload },
      };
    
    // Donation actions
    case ActionTypes.SET_CURRENT_DONATION:
      return {
        ...state,
        donations: { ...state.donations, currentDonation: action.payload },
      };
    
    case ActionTypes.CLEAR_CURRENT_DONATION:
      return {
        ...state,
        donations: { ...state.donations, currentDonation: null },
      };
    
    case ActionTypes.ADD_DONATION_TO_HISTORY:
      return {
        ...state,
        donations: {
          ...state.donations,
          donationHistory: [action.payload, ...state.donations.donationHistory],
        },
      };
    
    case ActionTypes.SET_DONATION_HISTORY:
      return {
        ...state,
        donations: { ...state.donations, donationHistory: action.payload },
      };
    
    case ActionTypes.SET_DONATION_LOADING:
      return {
        ...state,
        donations: { ...state.donations, loading: action.payload },
      };
    
    case ActionTypes.SET_DONATION_ERROR:
      return {
        ...state,
        donations: { ...state.donations, error: action.payload, loading: false },
      };
    
    case ActionTypes.UPDATE_DONATION_STATUS:
      return {
        ...state,
        donations: {
          ...state.donations,
          currentDonation: state.donations.currentDonation?.id === action.payload.id
            ? { ...state.donations.currentDonation, status: action.payload.status }
            : state.donations.currentDonation,
          donationHistory: state.donations.donationHistory.map(d =>
            d.id === action.payload.id ? { ...d, status: action.payload.status } : d
          ),
        },
      };
    
    // Notification actions
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...action.payload,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    
    // UI actions
    case ActionTypes.OPEN_DONATION_MODAL:
      return {
        ...state,
        ui: { ...state.ui, donationModalOpen: true },
      };
    
    case ActionTypes.CLOSE_DONATION_MODAL:
      return {
        ...state,
        ui: { ...state.ui, donationModalOpen: false },
      };
    
    case ActionTypes.SET_PAYMENT_PROCESSING:
      return {
        ...state,
        ui: { ...state.ui, paymentProcessing: action.payload },
      };
    
    default:
      return state;
  }
}

// Create Context
const AppContext = createContext(null);

// Provider Component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        const oldestNotification = state.notifications[0];
        if (oldestNotification) {
          dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: oldestNotification.id });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Selector hooks for specific state slices
export function useAuth() {
  const { state, dispatch } = useApp();
  return { auth: state.auth, dispatch };
}

export function useDonations() {
  const { state, dispatch } = useApp();
  return { donations: state.donations, dispatch };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  return { notifications: state.notifications, dispatch };
}

export function useUI() {
  const { state, dispatch } = useApp();
  return { ui: state.ui, dispatch };
}
