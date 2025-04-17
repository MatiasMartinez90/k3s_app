// /contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const KEYCLOAK_CONFIG = {
  url: 'https://keycloak.cloud-it.com.ar',
  realm: 'myrealm',
  clientId: 'nextjs-client'
};

export function AuthProvider({ children }) {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const keycloakInstance = new Keycloak(KEYCLOAK_CONFIG);
        
        // Intentar inicializar Keycloak silenciosamente
        const authenticated = await keycloakInstance.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256'
        });

        setKeycloak(keycloakInstance);
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          setUser(keycloakInstance.tokenParsed);
          
          // Configurar renovación automática de token
          keycloakInstance.onTokenExpired = () => {
            keycloakInstance.updateToken(30).catch(() => {
              // Si falla la renovación, desloguear al usuario
              setIsAuthenticated(false);
              setUser(null);
            });
          };
        }
      } catch (error) {
        console.error('Error al inicializar Keycloak:', error);
      } finally {
        setLoading(false);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login();
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  const getAccessToken = () => {
    return keycloak ? keycloak.token : null;
  };

  const refreshToken = async () => {
    if (keycloak) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          setUser(keycloak.tokenParsed);
        }
        return keycloak.token;
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        logout();
        return null;
      }
    }
    return null;
  };

  const value = {
    keycloak,
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getAccessToken,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
