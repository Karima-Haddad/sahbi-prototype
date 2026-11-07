import { useState, type ReactNode } from 'react'
import {
  initialJournal,
  initialAllowedFolders,
  initialExcludedFolders,
  initialNotifications,
  initialProfile,
  initialProposals,
  initialSources,
  initialTeachers,
  type Proposal,
} from './data'
import { StoreContext } from './storeContext'
import type { Store } from './storeContext'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState(initialProposals)
  const [journal, setJournal] = useState(initialJournal)
  const [sources, setSources] = useState(initialSources)
  const [paused, setPaused] = useState(false)
  const [setupCompleted, setSetupCompleted] = useState(false)
  const [trackProjects, setTrackProjects] = useState(true)
  const [notifications] = useState(initialNotifications)
  const [profile, setProfile] = useState(initialProfile)
  const [openedAssignmentIds, setOpenedAssignmentIds] = useState<string[]>([])
  const [completedAssignmentIds, setCompletedAssignmentIds] = useState<string[]>([])
  const [rememberedProposalKinds, setRememberedProposalKinds] = useState<Proposal['kind'][]>([])
  const [allowedFolders, setAllowedFolders] = useState(initialAllowedFolders)
  const [excludedFolders, setExcludedFolders] = useState(initialExcludedFolders)
  const [teachers, setTeachers] = useState(initialTeachers)
  const [autonomy, setAutonomy] = useState<'read_only' | 'propose' | 'approval'>('approval')
  const [notificationPreferences, setNotificationPreferences] = useState({ reminders: true, quietHours: false, morningSummary: true })
  const [handledEmailIds, setHandledEmailIds] = useState<string[]>([])

  const record = (title: string, detail: string, actor: 'Vous' | 'Toujours' = 'Vous') => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setJournal((entries) => [{ id: `journal-${Date.now()}`, title, detail, time: `Aujourd’hui · ${time}`, actor }, ...entries])
  }
  const resolveProposal = (id: string, status: Proposal['status'], remember = false, postponeUntil?: string) => {
    const proposal = proposals.find((item) => item.id === id)
    if (!proposal || proposal.status !== 'pending') return
    setProposals((items) => items.map((item) => item.id === id ? { ...item, status, postponeUntil, decidedBy: remember ? 'Toujours' : 'Vous' } : item))
    if (remember) setRememberedProposalKinds((items) => items.includes(proposal.kind) ? items : [...items, proposal.kind])
    record(
      status === 'accepted' ? proposal.title : status === 'refused' ? `Proposition refusée : ${proposal.title}` : `Reportée : ${proposal.title}`,
      status === 'accepted' ? 'Action acceptée' : status === 'refused' ? 'Aucune action effectuée' : `À revoir ${postponeUntil ?? 'plus tard'}`,
      remember ? 'Toujours' : 'Vous',
    )
  }

  const value: Store = {
    proposals, journal, sources, paused, setupCompleted, trackProjects, notifications, profile,
    openedAssignmentIds, rememberedProposalKinds, completedAssignmentIds,
    allowedFolders, excludedFolders, teachers, autonomy, notificationPreferences, handledEmailIds,
    accept: (id) => resolveProposal(id, 'accepted'),
    refuse: (id) => resolveProposal(id, 'refused'),
    postpone: (id, until) => resolveProposal(id, 'postponed', false, until),
    always: (id) => resolveProposal(id, 'accepted', true),
    undoJournalEntry: (id) => setJournal((entries) => entries.map((entry) => entry.id === id ? { ...entry, canceled: true } : entry)),
    togglePause: () => setPaused((value) => !value),
    disconnectSource: (id) => setSources((items) => items.map((source) => source.id === id ? { ...source, status: 'disconnected' } : source)),
    simulateProblem: (id) => setSources((items) => items.map((source) => source.id === id ? { ...source, status: 'problem' } : source)),
    reconnectSource: (id) => setSources((items) => items.map((source) => source.id === id ? { ...source, status: 'ok' } : source)),
    toggleTrackProjects: () => setTrackProjects((value) => !value),
    markAssignmentOpened: (id) => setOpenedAssignmentIds((items) => items.includes(id) ? items : [...items, id]),
    updateProfile: (name, avatar) => setProfile({ name: name.trim() || initialProfile.name, avatar }),
    connectSource: (id) => setSources((items) => items.map((source) => source.id === id ? { ...source, status: 'ok' } : source)),
    toggleSource: (id) => setSources((items) => items.map((source) => source.id === id ? { ...source, status: source.status === 'disconnected' ? 'ok' : 'disconnected' } : source)),
    setAutonomy: (mode) => setAutonomy(mode),
    setNotificationPreference: (key, enabled) => setNotificationPreferences((current) => ({ ...current, [key]: enabled })),
    addAllowedFolder: (folder) => setAllowedFolders((items) => items.includes(folder) ? items : [...items, folder]),
    removeAllowedFolder: (folder) => setAllowedFolders((items) => items.filter((item) => item !== folder)),
    addExcludedFolder: (folder) => setExcludedFolders((items) => items.includes(folder) ? items : [...items, folder]),
    removeExcludedFolder: (folder) => setExcludedFolders((items) => items.filter((item) => item !== folder)),
    addTeacher: (name, email) => setTeachers((items) => [...items, { id: `teacher-${Date.now()}`, name: name.trim(), email: email.trim() }]),
    removeTeacher: (id) => setTeachers((items) => items.filter((teacher) => teacher.id !== id)),
    removeAlwaysPermission: (kind) => setRememberedProposalKinds((items) => items.filter((item) => item !== kind)),
    markEmailHandled: (id) => setHandledEmailIds((items) => items.includes(id) ? items : [...items, id]),
    clearAllData: () => {
      setProposals(initialProposals)
      setJournal(initialJournal)
      setSources(initialSources)
      setPaused(false)
      setTrackProjects(false)
      setProfile(initialProfile)
      setOpenedAssignmentIds([])
      setCompletedAssignmentIds([])
      setRememberedProposalKinds([])
      setAllowedFolders(initialAllowedFolders)
      setExcludedFolders(initialExcludedFolders)
      setTeachers(initialTeachers)
      setAutonomy('approval')
      setNotificationPreferences({ reminders: true, quietHours: false, morningSummary: true })
      setHandledEmailIds([])
      setSetupCompleted(false)
    },
    completeSetup: () => setSetupCompleted(true),
    markAssignmentCompleted: (id) => {
      setCompletedAssignmentIds((items) => items.includes(id) ? items : [...items, id])
      record('Devoir marqué comme terminé', 'Aucune modification dans Classroom')
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
