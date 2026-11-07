import { createContext } from 'react'
import type { JournalEntry, Notification, Proposal, Source, Teacher } from './data'
import { initialProfile } from './data'

export type Store = {
  proposals: Proposal[]
  journal: JournalEntry[]
  sources: Source[]
  paused: boolean
  setupCompleted: boolean
  trackProjects: boolean
  notifications: Notification[]
  profile: typeof initialProfile
  openedAssignmentIds: string[]
  rememberedProposalKinds: Proposal['kind'][]
  completedAssignmentIds: string[]
  allowedFolders: string[]
  excludedFolders: string[]
  teachers: Teacher[]
  autonomy: 'read_only' | 'propose' | 'approval'
  notificationPreferences: { reminders: boolean; quietHours: boolean; morningSummary: boolean }
  handledEmailIds: string[]
  accept: (id: string) => void
  refuse: (id: string) => void
  postpone: (id: string, until: string) => void
  always: (id: string) => void
  undoJournalEntry: (id: string) => void
  togglePause: () => void
  disconnectSource: (id: Source['id']) => void
  simulateProblem: (id: Source['id']) => void
  reconnectSource: (id: Source['id']) => void
  toggleTrackProjects: () => void
  markAssignmentOpened: (id: string) => void
  markAssignmentCompleted: (id: string) => void
  updateProfile: (name: string, avatar: string) => void
  connectSource: (id: Source['id']) => void
  toggleSource: (id: Source['id']) => void
  setAutonomy: (mode: Store['autonomy']) => void
  setNotificationPreference: (key: keyof Store['notificationPreferences'], enabled: boolean) => void
  addAllowedFolder: (folder: string) => void
  removeAllowedFolder: (folder: string) => void
  addExcludedFolder: (folder: string) => void
  removeExcludedFolder: (folder: string) => void
  addTeacher: (name: string, email: string) => void
  removeTeacher: (id: string) => void
  removeAlwaysPermission: (kind: Proposal['kind']) => void
  markEmailHandled: (id: string) => void
  clearAllData: () => void
  completeSetup: () => void
}

export const StoreContext = createContext<Store | null>(null)
