import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Api } from '@jellyfin/sdk'
import { jellyfin } from './api'
import { storage } from './storage'

interface SessionStore {
  server: string | undefined
  username: string | undefined
  password: string | undefined
  authenticated: boolean
  authenticate: (server: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  api: () => Api | undefined
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      server: undefined,
      username: undefined,
      password: undefined,
      authenticated: false,

      authenticate: async (server, username, password) => {
        const api = jellyfin.createApi(server)
        const result = await api.authenticateUserByName(username, password)
        if (result.status >= 300) {
          throw new Error('Authentication failed')
        }
        set({ server, username, password, authenticated: true })
      },

      logout: async () => {
        set({ server: undefined, username: undefined, password: undefined, authenticated: false })
      },

      api: () => {
        const { server } = get()
        if (!server) return undefined
        return jellyfin.createApi(server)
      },
    }),
    {
      name: 'jellyfin-session',
      storage: createJSONStorage(() => ({
        getItem: (name) => storage.getString(name) ?? null,
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.delete(name)
      })),
    }
  )
)
