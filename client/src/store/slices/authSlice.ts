import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 从localStorage恢复状态
const loadAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // 保存到localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // 清除localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setLoading,
  setError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
