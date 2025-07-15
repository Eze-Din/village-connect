
import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { DataState, DataAction } from '../types';
import { MOCK_DATA } from '../constants';

const initialState: DataState = {
  users: [],
  staff: [],
  staffLeave: [],
  bids: [],
  bidSubmissions: [],
  serviceRequests: [],
  announcements: [],
};

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] };
    case 'UPDATE_STAFF':
      return { ...state, staff: state.staff.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_STAFF':
      return { ...state, staff: state.staff.filter(s => s.id !== action.payload) };
    case 'ADD_BID':
      return { ...state, bids: [...state.bids, action.payload] };
    case 'UPDATE_BID':
      return { ...state, bids: state.bids.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BID':
      return { ...state, bids: state.bids.filter(b => b.id !== action.payload) };
    case 'ADD_BID_SUBMISSION':
      return { ...state, bidSubmissions: [...state.bidSubmissions, action.payload] };
    case 'ADD_ANNOUNCEMENT':
        return { ...state, announcements: [action.payload, ...state.announcements] };
    case 'UPDATE_ANNOUNCEMENT':
        return { ...state, announcements: state.announcements.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ANNOUNCEMENT':
        return { ...state, announcements: state.announcements.filter(a => a.id !== action.payload) };
    case 'ADD_SERVICE_REQUEST':
        return { ...state, serviceRequests: [action.payload, ...state.serviceRequests] };
    case 'UPDATE_SERVICE_REQUEST':
        return { ...state, serviceRequests: state.serviceRequests.map(r => r.id === action.payload.id ? action.payload : r) };
    default:
      return state;
  }
};

interface DataContextType {
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialState = (): DataState => {
    try {
        const storedData = localStorage.getItem('villageData');
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    }
    // If nothing in localStorage, initialize with mock data
    return MOCK_DATA;
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState, getInitialState);

  useEffect(() => {
    localStorage.setItem('villageData', JSON.stringify(state));
  }, [state]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
