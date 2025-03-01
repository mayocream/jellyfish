import { useContext, createContext, type PropsWithChildren } from 'react'
import { useMMKVBoolean } from 'react-native-mmkv'
import { storage } from './storage'

const AuthContext = createContext<{
  authenticated: boolean
  setAuthenticated: (value: boolean) => void
}>({
  authenticated: false,
  setAuthenticated: () => {},
})

export const useSession = () => useContext(AuthContext)

export function SessionProvider({ children }: PropsWithChildren) {
  const [authenticated, setAuthenticated] = useMMKVBoolean('authenticated', storage)
  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated ?? false,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
