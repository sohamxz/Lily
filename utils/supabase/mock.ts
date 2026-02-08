
export const createMockSupabase = () => ({
    auth: {
        getUser: async () => ({ 
            data: { 
                user: { 
                    id: 'mock-user-id', 
                    email: 'admin@flowstate.com',
                    user_metadata: { name: 'Admin User' }
                } 
            }, 
            error: null 
        }),
        signInWithPassword: async () => ({ 
            data: { 
                user: { id: 'mock-user-id' }, 
                session: { access_token: 'mock-token' } 
            }, 
            error: null 
        }),
        signUp: async () => ({ 
            data: { 
                user: { id: 'mock-user-id' }, 
                session: { access_token: 'mock-token' } 
            }, 
            error: null 
        }),
        signOut: async () => ({ error: null }),
    }
});
