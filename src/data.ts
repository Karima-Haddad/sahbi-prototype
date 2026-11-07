export type CourseId = 'reseaux' | 'bases-donnees' | 'java' | 'algorithmique' | 'genie-logiciel' | 'systemes'

export type Course = {
  id: CourseId
  name: string
  color: string
  softColor: string
}

export const courses: Course[] = [
  { id: 'reseaux', name: 'Réseaux', color: '#78B7F5', softColor: '#E8F3FF' },
  { id: 'bases-donnees', name: 'Bases de données', color: '#9B8AFB', softColor: '#F0EDFF' },
  { id: 'java', name: 'Programmation Java', color: '#FFA96B', softColor: '#FFF1E5' },
  { id: 'algorithmique', name: 'Algorithmique', color: '#F28BC0', softColor: '#FDEAF4' },
  { id: 'genie-logiciel', name: 'Génie logiciel', color: '#57CDB2', softColor: '#E4F8F3' },
  { id: 'systemes', name: "Systèmes d'exploitation", color: '#E7C75D', softColor: '#FBF5D9' },
]

export type Document = { name: string; path: string; page?: number }
export type Assignment = {
  id: string
  title: string
  courseId: CourseId
  description: string
  dueInDays: number | null
  dueLabel: string
  status: 'new' | 'urgent' | 'linked' | 'submitted' | 'late' | 'open'
  dateModified?: boolean
  folder?: string
  confidence?: number
  projectId?: string
  relatedEmailIds: string[]
  documents: [Document, Document]
}

export const assignments: Assignment[] = [
  {
    id: 'tp3-reseaux', title: 'TP3 : client/serveur UDP', courseId: 'reseaux',
    description: 'Créer un client et un serveur UDP, puis observer les échanges de datagrammes.',
    dueInDays: 3, dueLabel: '10 nov.', status: 'new', dateModified: true,
    folder: 'D:\\Etudes\\Reseaux\\TP3', confidence: 0.86, relatedEmailIds: ['email-tp3'],
    documents: [{ name: 'Cours_UDP.pdf', path: 'D:\\Cours\\Reseaux\\Cours_UDP.pdf', page: 4 }, { name: 'Enonce_TP3.pdf', path: 'D:\\Etudes\\Reseaux\\Enonce_TP3.pdf' }],
  },
  {
    id: 'algo-complexite', title: 'Exercices de complexité', courseId: 'algorithmique',
    description: 'Résoudre les exercices sur les complexités temporelles et spatiales.',
    dueInDays: 1, dueLabel: '8 nov.', status: 'urgent', relatedEmailIds: ['email-algo'],
    documents: [{ name: 'TD_complexite.pdf', path: 'D:\\Cours\\Algorithmique\\TD_complexite.pdf', page: 2 }, { name: 'Fiche_recursivite.pdf', path: 'D:\\Cours\\Algorithmique\\Fiche_recursivite.pdf' }],
  },
  {
    id: 'banque-java', title: 'Projet : application bancaire', courseId: 'java',
    description: 'Finaliser les opérations de compte et les tests du projet bancaire.',
    dueInDays: 2, dueLabel: '9 nov.', status: 'linked', projectId: 'projet-java-banque', relatedEmailIds: ['email-java'],
    documents: [{ name: 'Sujet_projet.pdf', path: 'D:\\Cours\\Java\\Sujet_projet.pdf', page: 1 }, { name: 'UML_banque.pdf', path: 'D:\\Cours\\Java\\UML_banque.pdf' }],
  },
  {
    id: 'sql-jointures', title: 'TD : requêtes et jointures', courseId: 'bases-donnees',
    description: 'Écrire des requêtes SQL avec jointures et agrégations.',
    dueInDays: 5, dueLabel: '12 nov.', status: 'open', relatedEmailIds: ['email-sql'],
    documents: [{ name: 'TD_SQL.pdf', path: 'D:\\Cours\\BDD\\TD_SQL.pdf', page: 3 }, { name: 'Schema_bibliotheque.png', path: 'D:\\Cours\\BDD\\Schema_bibliotheque.png' }],
  },
  {
    id: 'genie-modelisation', title: 'Diagramme de classes', courseId: 'genie-logiciel',
    description: 'Modéliser les principales entités du système de réservation.',
    dueInDays: 7, dueLabel: '14 nov.', status: 'open', relatedEmailIds: [],
    documents: [{ name: 'Consignes_UML.pdf', path: 'D:\\Cours\\GenieLogiciel\\Consignes_UML.pdf', page: 5 }, { name: 'Exemple_UML.pdf', path: 'D:\\Cours\\GenieLogiciel\\Exemple_UML.pdf' }],
  },
  {
    id: 'systemes-processus', title: 'TP : gestion des processus', courseId: 'systemes',
    description: 'Expérimenter la création et la synchronisation de processus.',
    dueInDays: 9, dueLabel: '16 nov.', status: 'open', relatedEmailIds: [],
    documents: [{ name: 'TP_processus.pdf', path: 'D:\\Cours\\Systemes\\TP_processus.pdf', page: 1 }, { name: 'Cours_processus.pdf', path: 'D:\\Cours\\Systemes\\Cours_processus.pdf' }],
  },
  {
    id: 'bdd-normalisation', title: 'Exercice de normalisation', courseId: 'bases-donnees',
    description: 'Étudier les dépendances fonctionnelles et normaliser le schéma.',
    dueInDays: null, dueLabel: 'Sans date', status: 'open', relatedEmailIds: [],
    documents: [{ name: 'Normalisation.pdf', path: 'D:\\Cours\\BDD\\Normalisation.pdf', page: 6 }, { name: 'Exercices_BDD.pdf', path: 'D:\\Cours\\BDD\\Exercices_BDD.pdf' }],
  },
  {
    id: 'java-classes', title: 'Exercice : héritage Java', courseId: 'java',
    description: 'Compléter les classes et vérifier le comportement de l’héritage.',
    dueInDays: 0, dueLabel: 'Rendu', status: 'submitted', relatedEmailIds: [],
    documents: [{ name: 'Heritage_java.pdf', path: 'D:\\Cours\\Java\\Heritage_java.pdf', page: 3 }, { name: 'Exemple_classes.java', path: 'D:\\Cours\\Java\\Exemple_classes.java' }],
  },
  {
    id: 'reseaux-tcp', title: 'Compte rendu : sockets TCP', courseId: 'reseaux',
    description: 'Rédiger les observations du TP sur les sockets TCP.',
    dueInDays: -2, dueLabel: 'En retard', status: 'late', relatedEmailIds: [],
    documents: [{ name: 'TP_TCP.pdf', path: 'D:\\Cours\\Reseaux\\TP_TCP.pdf', page: 2 }, { name: 'Cours_TCP.pdf', path: 'D:\\Cours\\Reseaux\\Cours_TCP.pdf' }],
  },
]

export type TeacherEmail = {
  id: string
  sender: string
  name: string
  subject: string
  summary: string
  detectedDate?: string
  courseId: CourseId
  assignmentId?: string
  received: string
}

export const emails: TeacherEmail[] = [
  { id: 'email-tp3', sender: 'm.benali@universite.example', name: 'M. Benali', subject: 'Report de la date du TP3', summary: 'Le TP3 est reporté au 10 novembre.', detectedDate: '10/11', courseId: 'reseaux', assignmentId: 'tp3-reseaux', received: 'Aujourd’hui' },
  { id: 'email-algo', sender: 's.mansouri@universite.example', name: 'Mme Mansouri', subject: 'Rappel : exercices de complexité', summary: 'Les exercices sont à rendre avant le prochain cours.', courseId: 'algorithmique', assignmentId: 'algo-complexite', received: 'Hier' },
  { id: 'email-java', sender: 'a.haddad@universite.example', name: 'M. Haddad', subject: 'Projet Java — dépôt attendu', summary: 'Pensez à vérifier le dépôt et les tests du projet.', courseId: 'java', assignmentId: 'banque-java', received: 'Hier' },
]

export type Proposal = {
  id: string
  title: string
  kind: 'create_assignment_folder' | 'book_work_slot'
  reason: string
  assignmentId: string
  folder?: string
  copies?: string[]
  possibleSlots?: string[]
  estimateHours?: number
  status: 'pending' | 'postponed' | 'accepted' | 'refused'
  postponeUntil?: string
  decidedBy?: 'Vous' | 'Toujours'
}

export const initialProposals: Proposal[] = [
  {
    id: 'proposal-folder', title: 'Créer le dossier du TP3 Réseaux', kind: 'create_assignment_folder',
    reason: 'Le TP3 est à rendre dans 3 jours.', assignmentId: 'tp3-reseaux',
    folder: 'D:\\Etudes\\Reseaux\\TP3', copies: ['Enonce_TP3.pdf'], status: 'pending',
  },
  {
    id: 'proposal-slot', title: 'Réserver un créneau pour le TP3', kind: 'book_work_slot',
    reason: 'Un temps de travail aiderait à avancer.', assignmentId: 'tp3-reseaux',
    possibleSlots: ['Aujourd’hui · 16 h', 'Demain · 10 h'], estimateHours: 4, status: 'pending',
  },
]

export type JournalEntry = { id: string; title: string; detail: string; time: string; actor?: 'Vous' | 'Toujours'; canceled?: boolean }
export const initialJournal: JournalEntry[] = [
  { id: 'journal-1', title: 'TP TCP lié à Réseaux', detail: 'Document associé', time: 'Aujourd’hui · 09:20' },
  { id: 'journal-2', title: 'Nouvel email détecté', detail: 'Réseaux · M. Benali', time: 'Aujourd’hui · 08:45' },
  { id: 'journal-3', title: 'Dossier Java analysé', detail: 'projet-java-banque', time: 'Hier · 18:10' },
  { id: 'journal-4', title: 'Cours UDP retrouvé', detail: 'Cours_UDP.pdf · page 4', time: 'Hier · 15:32' },
]

export type SourceStatus = 'ok' | 'syncing' | 'problem' | 'disconnected'
export type Source = { id: 'classroom' | 'calendar' | 'gmail' | 'files' | 'git'; name: string; status: SourceStatus }
export const initialSources: Source[] = [
  { id: 'classroom', name: 'Classroom', status: 'ok' },
  { id: 'calendar', name: 'Agenda', status: 'ok' },
  { id: 'gmail', name: 'Gmail', status: 'syncing' },
  { id: 'files', name: 'Fichiers', status: 'ok' },
  { id: 'git', name: 'Git', status: 'ok' },
]

export type GitProject = { id: string; name: string; status: 'on_track' | 'at_risk' | 'inactive'; lastCommit: string; commitsIn7Days: number; assignmentId?: string }
export const projects: GitProject[] = [
  { id: 'projet-java-banque', name: 'projet-java-banque', status: 'on_track', lastCommit: 'Aujourd’hui', commitsIn7Days: 8, assignmentId: 'banque-java' },
  { id: 'reseau-chat', name: 'reseau-chat', status: 'at_risk', lastCommit: 'Il y a 4 jours', commitsIn7Days: 0, assignmentId: 'tp3-reseaux' },
  { id: 'algo-tp1', name: 'algo-tp1', status: 'inactive', lastCommit: 'Il y a 2 mois', commitsIn7Days: 0, assignmentId: 'algo-complexite' },
]

export type CalendarEvent = { id: string; title: string; date: string; time: string; courseId: CourseId }
export const calendarEvents: CalendarEvent[] = [
  { id: 'event-1', title: 'Réseaux', date: 'Aujourd’hui', time: '10:00', courseId: 'reseaux' },
  { id: 'event-2', title: 'Algorithmique', date: 'Aujourd’hui', time: '14:00', courseId: 'algorithmique' },
  { id: 'event-3', title: 'Programmation Java', date: 'Demain', time: '09:00', courseId: 'java' },
  { id: 'event-4', title: 'Bases de données', date: 'Demain', time: '13:30', courseId: 'bases-donnees' },
  { id: 'event-5', title: 'Génie logiciel', date: '10 nov.', time: '11:00', courseId: 'genie-logiciel' },
  { id: 'event-6', title: "Systèmes d'exploitation", date: '11 nov.', time: '15:00', courseId: 'systemes' },
]

export type Notification = {
  id: string
  title: string
  detail: string
  urgent?: boolean
  level?: 'info' | 'important' | 'urgent'
  day?: string
  time: string
}
export const initialNotifications: Notification[] = [
  { id: 'notification-1', title: 'TP3 Réseaux à rendre dans 3 jours', detail: 'Un dossier est proposé.', urgent: true, level: 'urgent', day: 'Aujourd’hui', time: 'Maintenant' },
  { id: 'notification-2', title: 'Exercices de complexité', detail: 'À rendre demain.', level: 'important', day: 'Aujourd’hui', time: 'Il y a 1 h' },
  { id: 'notification-3', title: 'Un email de M. Benali', detail: 'Réseaux · date détectée : 10/11', level: 'info', day: 'Aujourd’hui', time: 'Il y a 2 h' },
  { id: 'notification-4', title: 'Projet Java mis à jour', detail: '8 commits cette semaine.', level: 'info', day: 'Hier', time: 'Hier' },
  { id: 'notification-5', title: 'Cours UDP retrouvé', detail: 'Cours_UDP.pdf · page 4', level: 'important', day: 'Hier', time: 'Hier' },
]

export const searchExample = {
  query: 'Où est mon cours sur UDP ?',
  answer: 'Dans Réseaux, avec l’énoncé du TP3.',
  document: { name: 'Cours_UDP.pdf', path: 'D:\\Cours\\Reseaux\\Cours_UDP.pdf', page: 4 },
}

export const initialProfile = { name: 'Sara', avatar: 'S' }

export const avatarOptions = [
  { id: 'sparkles', color: '#E8E3FF' },
  { id: 'smile', color: '#FFE7DD' },
  { id: 'code', color: '#DFF5EE' },
  { id: 'star', color: '#FFF2C9' },
  { id: 'heart', color: '#FCE3EF' },
  { id: 'rocket', color: '#DCEEFF' },
  { id: 'leaf', color: '#E8F4D9' },
  { id: 'coffee', color: '#F3E6D9' },
  { id: 'moon', color: '#E8E9FC' },
  { id: 'sun', color: '#FFECCF' },
]

export type Teacher = { id: string; name: string; email: string }
export const initialTeachers: Teacher[] = [
  { id: 'teacher-1', name: 'M. Benali', email: 'm.benali@universite.example' },
  { id: 'teacher-2', name: 'Mme Mansouri', email: 's.mansouri@universite.example' },
]

export const initialAllowedFolders = ['D:\\Etudes', 'D:\\Cours']
export const initialExcludedFolders = ['D:\\Etudes\\Personnel']
