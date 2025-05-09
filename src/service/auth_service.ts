export const login_user = async (email: string, password: string) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const json = await response.json();
  
    if (!response.ok || !json.data || !json.data.token || !json.data.user) {
      throw new Error(json.message || 'Credenciales incorrectas');
    }
  
    return {
      token: json.data.token,
      user: json.data.user,
    };
  };
  