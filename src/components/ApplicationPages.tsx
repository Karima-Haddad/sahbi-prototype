import {
  AlertTriangle, ArrowRight, Bell, BookOpen, CalendarDays, Check, Clock3, Code2,
  Folder, FolderOpen, GitBranch, Heart, Info, Mail, Moon, Pause, Play, Plus, Search,
  ShieldCheck, Sparkles, Sun, Trash2, UserRound, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  assignments, avatarOptions, calendarEvents, courses, emails, projects, searchExample,
  type Source, type Teacher,
} from '../data'
import { useStore } from '../useStore'
import { AvatarBadge, CourseBadge, EmptyState, Mascot, Toast } from './common'

const sourceNames: Record<Source['id'], string> = {
  classroom: 'Classroom', calendar: 'Agenda', gmail: 'Gmail', files: 'Fichiers', git: 'Git',
}

export function WelcomePage() {
  const { profile, updateProfile, connectSource, allowedFolders, addAllowedFolder, removeAllowedFolder, teachers, addTeacher, completeSetup } = useStore()
  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.name)
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [error, setError] = useState('')
  const [pendingSource, setPendingSource] = useState<Source['id'] | null>(null)
  const [connectedServices, setConnectedServices] = useState<Source['id'][]>([])
  const [refusedSource, setRefusedSource] = useState<Source['id'] | null>(null)
  const [folderError, setFolderError] = useState('')
  const navigate = useNavigate()
  const folders = ['D:\\Etudes', 'D:\\Cours', 'D:\\Projets', 'C:\\', 'C:\\Users\\Sara', 'AppData', 'C:\\Windows']
  const sourceIds: Source['id'][] = ['classroom', 'calendar', 'gmail']

  useEffect(() => {
    if (!pendingSource) return
    const timer = window.setTimeout(() => {
      connectSource(pendingSource)
      setConnectedServices((items) => items.includes(pendingSource) ? items : [...items, pendingSource])
      setError('')
      setRefusedSource(null)
      setPendingSource(null)
    }, 2000)
    return () => window.clearTimeout(timer)
  }, [pendingSource, connectSource])

  const safeFolder = (folder: string) => {
    const normalized = folder.trim().toLocaleLowerCase().replaceAll('/', '\\')
    return !['c:\\', 'c:\\users\\sara', 'appdata', 'c:\\windows'].includes(normalized) && !normalized.includes('\\appdata')
  }
  const selectFolder = (folder: string) => {
    if (!safeFolder(folder)) {
      setFolderError("Ce dossier n'est pas autorisé.")
      return
    }
    setFolderError('')
    if (!allowedFolders.includes(folder)) addAllowedFolder(folder)
  }

  const submitTeacher = (event: FormEvent) => {
    event.preventDefault()
    if (!teacherName.trim() || !teacherEmail.trim().endsWith('@universite.example')) {
      setError('Utilise une adresse @universite.example.')
      return
    }
    addTeacher(teacherName, teacherEmail)
    setTeacherName('')
    setTeacherEmail('')
    setError('')
  }
  const finish = () => {
    updateProfile(name, profile.avatar)
    completeSetup()
    navigate('/')
  }

  if (step === 2 && pendingSource) {
    return <main className="welcome-flow"><Link to="/" className="welcome-brand"><span>s</span> sahbi</Link><div className="welcome-progress">{[0, 1, 2, 3, 4].map((item) => <span key={item} className={item <= step ? 'current' : ''} />)}</div><div className="welcome-content connection-wait"><Mascot size={108} /><span className="eyebrow">CONNEXION SÉCURISÉE</span><h1>Terminez la connexion<br />dans votre navigateur…</h1><span className="connection-spinner" aria-label="Connexion en cours" /><strong className="waiting-service">{sourceNames[pendingSource]}</strong><button type="button" className="button-secondary" onClick={() => setPendingSource(null)}>Annuler</button></div><span className="welcome-foot">Aucun mot de passe n’est demandé dans Sahbi.</span></main>
  }

  return (
    <main className="welcome-flow">
      <Link to="/" className="welcome-brand"><span>s</span> sahbi</Link>
      <div className="welcome-progress" aria-label={`Étape ${step + 1} sur 5`}>{[0, 1, 2, 3, 4].map((item) => <span key={item} className={item <= step ? 'current' : ''} />)}</div>
      <div className="welcome-content">
        <Mascot size={step === 0 ? 112 : 84} />
        {step === 0 && <>
          <span className="eyebrow">ÉTAPE 1 · TON ESPACE</span><h1>Choisis ton avatar</h1>
          <div className="avatar-choices">{avatarOptions.map((option) => <button type="button" key={option.id} className={`avatar-choice${profile.avatar === option.id ? ' chosen' : ''}`} aria-label={`Avatar ${option.id}`} aria-pressed={profile.avatar === option.id} onClick={() => updateProfile(name, option.id)}><AvatarBadge avatar={option.id} size={49} /></button>)}</div>
          <label className="welcome-name">Comment t'appelles-tu ?<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ton prénom" maxLength={28} /></label>
          <button type="button" className="welcome-next" onClick={() => { updateProfile(name, profile.avatar); setStep(1) }}>Continuer <ArrowRight size={17} /></button>
        </>}
        {step === 1 && <>
          <span className="eyebrow">ÉTAPE 2 · EN TOUTE TRANSPARENCE</span><h1>Tu gardes le contrôle</h1>
          <div className="welcome-reassurance"><div><BookOpen size={19} /><span>Devoirs</span></div><div><CalendarDays size={19} /><span>Agenda</span></div><div><Mail size={19} /><span>Emails enseignants</span></div></div>
          <p className="reassurance-copy">Sahbi lit vos devoirs, votre agenda et les emails de vos enseignants. Il n'envoie jamais d'email.</p>
          <button type="button" className="welcome-next" onClick={() => { setError(''); setRefusedSource(null); setStep(2) }}>Continuer <ArrowRight size={17} /></button>
          <button type="button" className="welcome-skip" onClick={() => setStep(0)}>Retour</button>
        </>}
        {step === 2 && <>
          <span className="eyebrow">ÉTAPE 3 · TES COURS</span><h1>Connecte Google</h1><p className="welcome-hint">Choisis les sources à relier.</p>
          <div className="connect-options">{sourceIds.map((id) => {
            const connected = connectedServices.includes(id)
            const Icon = id === 'classroom' ? BookOpen : id === 'calendar' ? CalendarDays : Mail
            return <button type="button" className={`connect-option${connected ? ' connected' : ''}`} key={id} onClick={() => { setRefusedSource(null); setPendingSource(id) }}><span><Icon size={20} /><strong>{sourceNames[id]}</strong></span><span className="connect-state">{connected ? <><Check size={14} /> Relié</> : 'Connecter'}</span></button>
          })}</div>
          {error && <div className="connection-error"><span>L'accès à ce service est refusé.</span><button type="button" onClick={() => { setPendingSource(refusedSource ?? 'gmail'); setRefusedSource(null); setError('') }}>Réessayer</button></div>}
          <details className="welcome-demo"><summary>Démo</summary><button type="button" onClick={() => { setPendingSource(null); setError("L'accès à ce service est refusé."); setRefusedSource('gmail') }}>Simuler un refus</button></details>
          <button type="button" className="welcome-next" onClick={() => { setError(''); setStep(3) }}>Continuer <ArrowRight size={17} /></button>
          <button type="button" className="welcome-skip" onClick={() => setStep(3)}>Plus tard</button>
        </>}
        {step === 3 && <>
          <span className="eyebrow">ÉTAPE 4 · TES FICHIERS</span><h1>Quels dossiers autoriser ?</h1><p className="welcome-hint">Sahbi y cherchera tes documents de cours.</p>
          <div className="folder-select-list">{folders.map((folder) => {
            const selected = allowedFolders.includes(folder)
            return <button type="button" key={folder} className={`folder-select${selected ? ' selected' : ''}${!safeFolder(folder) ? ' folder-rejected' : ''}`} aria-pressed={selected} onClick={() => selected ? removeAllowedFolder(folder) : selectFolder(folder)}><Folder size={18} /><span>{folder}</span><span className="folder-select-check">{selected && <Check size={15} />}</span></button>
          })}</div>
          {folderError && <span className="form-error folder-error">{folderError}</span>}
          <button type="button" className="button-secondary welcome-add-folder" onClick={() => selectFolder(['D:\\Etudes', 'D:\\Cours', 'D:\\Projets', 'D:\\Travaux'].find((folder) => !allowedFolders.includes(folder)) ?? 'D:\\Travaux')}><Plus size={15} />Ajouter un dossier</button>
          <button type="button" className="welcome-next" onClick={() => { setFolderError(''); setStep(4) }}>Continuer <ArrowRight size={17} /></button>
        </>}
        {step === 4 && <>
          <span className="eyebrow">ÉTAPE 5 · TES ENSEIGNANTS</span><h1>Qui sont tes enseignants ?</h1><p className="welcome-hint">Ajoute leurs adresses universitaires.</p>
          <form className="teacher-form" onSubmit={submitTeacher}><input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Nom" aria-label="Nom de l’enseignant" /><input value={teacherEmail} onChange={(event) => setTeacherEmail(event.target.value)} placeholder="nom@universite.example" aria-label="Adresse universitaire" type="email" /><button type="submit" className="welcome-add-teacher" aria-label="Ajouter"><Plus size={17} /></button></form>
          {error && <span className="form-error">{error}</span>}
          <div className="welcome-teachers">{teachers.map((teacher) => <span key={teacher.id}><UserRound size={13} />{teacher.name}</span>)}</div>
          <button type="button" className="welcome-next" onClick={finish}>Commencer <Sparkles size={16} /></button>
          <button type="button" className="welcome-skip" onClick={finish}>Je le ferai plus tard</button>
        </>}
      </div>
      <span className="welcome-foot">Tes données restent sur ton ordinateur.</span>
    </main>
  )
}

export function SearchPage() {
  const location = useLocation()
  const locationState = location.state as { query?: unknown } | null
  const locationQuery = typeof locationState?.query === 'string' ? locationState.query : ''
  const [query, setQuery] = useState(locationQuery)
  const [submitted, setSubmitted] = useState(locationQuery)
  const [opened, setOpened] = useState(false)
  const samples = [searchExample.query, 'Où est l’énoncé du TP3 ?', 'Cours de bases de données']
  const normalized = submitted.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const documentMatches = assignments.flatMap((assignment) => assignment.documents.map((document) => ({ document, assignment }))).filter(({ document, assignment }) => {
    if (!normalized.trim()) return false
    const terms = normalized.split(/[^a-z0-9]+/).filter((term) => term.length > 2 && !['cours', 'dans', 'mon', 'mes', 'est', 'une', 'pour'].includes(term))
    return terms.some((term) => `${document.name} ${document.path} ${assignment.title} ${courses.find((course) => course.id === assignment.courseId)?.name}`.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(term))
  })
  const knownUdpQuestion = /udp/.test(normalized)
  const results = knownUdpQuestion
    ? assignments.filter((item) => item.id === 'tp3-reseaux').flatMap((assignment) => assignment.documents.filter((document) => document.name === searchExample.document.name).map((document) => ({ document, assignment })))
    : documentMatches
  const answer = knownUdpQuestion ? searchExample.answer : results.length ? `J’ai trouvé ${results[0].document.name} dans ${courses.find((course) => course.id === results[0].assignment.courseId)?.name}.` : ''
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(query.trim()); setOpened(false) }

  return (
    <div className="search-page student-page">
      <div className="search-page-head"><div className="search-orb"><Search size={22} /></div><span className="eyebrow">DANS TES DOCUMENTS</span><h1>Qu’est-ce qu’on cherche ?</h1>
        <form className="search-big-field" onSubmit={submit}><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. cours sur UDP…" aria-label="Rechercher dans les documents" /><button type="submit">Rechercher</button></form>
        <div className="search-examples"><span>Essaie :</span>{samples.map((sample) => <button type="button" key={sample} onClick={() => { setQuery(sample); setSubmitted(sample); setOpened(false) }}>{sample}</button>)}</div>
      </div>
      {submitted && (results.length ? <section className="search-answer-card"><div className="search-answer-top"><span className="answer-icon"><Sparkles size={17} /></span><span>RÉPONSE DE SAHBI</span></div><p>{answer}</p><div className="search-result-list">{results.map(({ document, assignment }) => <div className="search-file-chip" key={`${assignment.id}-${document.name}`}><CourseBadge courseId={assignment.courseId} compact /><span className="search-file-name"><strong>{document.name}</strong>{document.page && <small>Page {document.page}</small>}</span><button type="button" className="button-secondary small" onClick={() => setOpened(true)}>{opened ? 'Ouvert' : 'Ouvrir'}</button></div>)}</div>{opened && <span className="search-open-state">Document prêt à consulter.</span>}</section> : <div className="search-not-found"><Mascot size={60} /><strong>Je n'ai rien trouvé dans vos documents.</strong></div>)}
      {!submitted && <div className="search-empty-hint"><Mascot size={58} /><span>Pose une question ou choisis un exemple.</span></div>}
    </div>
  )
}

export function EmailsPage() {
  const { handledEmailIds, markEmailHandled } = useStore()
  return <div className="student-page"><div className="page-heading"><div><span className="eyebrow">SANS OUVRIR LE MESSAGE</span><h1>Emails</h1></div><span className="page-count">{emails.length - handledEmailIds.length} à traiter</span></div>
    <div className="email-list">{emails.map((email) => <article className={`teacher-email-card${handledEmailIds.includes(email.id) ? ' email-treated' : ''}`} key={email.id} style={{ '--course': courses.find((course) => course.id === email.courseId)?.color } as CSSProperties}>
      <span className="email-course-strip" /><CourseBadge courseId={email.courseId} compact />
      <div className="teacher-email-content"><div className="teacher-email-meta"><strong>{email.name}</strong><span>{email.received}</span></div><h2>{email.subject}</h2><p>{email.summary}</p>{email.detectedDate && <span className="email-date-chip"><CalendarDays size={12} />Date détectée · {email.detectedDate}</span>}</div>
      <div className="teacher-email-actions"><a href="https://mail.google.com" target="_blank" rel="noreferrer">Ouvrir dans Gmail <ArrowRight size={13} /></a><button type="button" className={handledEmailIds.includes(email.id) ? 'email-treated-button' : ''} onClick={() => markEmailHandled(email.id)}>{handledEmailIds.includes(email.id) ? <><Check size={14} /> Traité</> : 'Traité'}</button></div>
    </article>)}</div>
  </div>
}

const weekDays = ['Aujourd’hui', 'Demain', '9 nov.', '10 nov.', '11 nov.', '12 nov.', '13 nov.']
const freeSlots = ['15:00 · Libre', '11:30 · Libre', '09:00 · Libre']

export function CalendarPage() {
  return <div className="student-page"><div className="page-heading"><div><span className="eyebrow">7 — 13 NOVEMBRE</span><h1>Agenda</h1></div><span className="read-only-label"><CalendarDays size={13} />Lecture seule</span></div>
    <div className="week-grid">{weekDays.map((day) => {
      const dayEvents = calendarEvents.filter((event) => event.date === day)
      const freeTime = freeSlots[weekDays.indexOf(day) % freeSlots.length]
      return <section className={`week-day${day === 'Aujourd’hui' ? ' today' : ''}`} key={day}><h2>{day}</h2>{dayEvents.map((event) => <article className="week-event" key={event.id} style={{ '--course': courses.find((course) => course.id === event.courseId)?.color, '--course-soft': courses.find((course) => course.id === event.courseId)?.softColor } as CSSProperties}><span>{event.time}</span><strong>{event.title}</strong></article>)}<div className="free-slot"><span>{freeTime}</span></div></section>
    })}</div>
  </div>
}

export function PlanningPage() {
  const location = useLocation()
  const { profile } = useStore()
  const locationState = location.state as { assignmentId?: unknown } | null
  const assignmentId = typeof locationState?.assignmentId === 'string' ? locationState.assignmentId : assignments.find((item) => item.status === 'new')?.id
  const assignment = assignments.find((item) => item.id === assignmentId) ?? assignments[0]
  const [reservedSlot, setReservedSlot] = useState('')
  const slots = ['Aujourd’hui · 16 h — 2 h', 'Demain · 10 h — 1 h 30', 'Demain · 14 h — 1 h']
  return <div className="student-page planning-page"><div className="page-heading"><div><span className="eyebrow">UN PETIT PAS À LA FOIS</span><h1>Planification</h1></div><CalendarDays className="heading-sparkle" size={22} /></div>
    <section className="planning-summary"><div className="planning-summary-icon"><Clock3 size={22} /></div><div><span>ESTIMATION</span><strong>{assignment.id === 'tp3-reseaux' ? 4 : 2} h</strong></div><div className="planning-assignment"><CourseBadge courseId={assignment.courseId} /><strong>{assignment.title}</strong></div></section>
    <h2 className="week-title">Créneaux proposés</h2><div className="planning-week">{weekDays.slice(0, 5).map((day, index) => <div className={`planning-day${index < 2 ? ' has-slot' : ''}`} key={day}><span>{day}</span>{index < 2 ? <CalendarDays size={16} /> : <i />}</div>)}</div>
    <div className="planning-slot-list">{slots.map((slot) => <article className="planning-slot" key={slot}><span className="planning-slot-icon"><CalendarDays size={16} /></span><div><strong>{slot.split(' — ')[0]}</strong><span>{slot.split(' — ')[1]}</span></div><button type="button" className={`button-primary small${reservedSlot === slot ? ' slot-reserved' : ''}`} onClick={() => setReservedSlot(slot)}>{reservedSlot === slot ? <><Check size={13} /> Réservé</> : 'Réserver'}</button></article>)}</div>
    {reservedSlot && <Toast message="Créneau réservé dans Sahbi" onClose={() => setReservedSlot('')} />}
    <span className="planning-greeting">Bon courage, {profile.name} !</span>
  </div>
}

export function ProjectsPage() {
  const { trackProjects } = useStore()
  const statusText = { on_track: 'Sur la bonne voie', at_risk: 'À risque', inactive: 'Inactif' }
  return <div className="student-page"><div className="page-heading"><div><span className="eyebrow">SUIVI LOCAL</span><h1>Projets Git</h1></div><GitBranch className="heading-sparkle" size={21} /></div>
    {!trackProjects ? <EmptyState title="Suivi désactivé" detail="Active-le dans les paramètres." /> : <div className="project-card-grid">{projects.map((project) => {
      const linked = assignments.find((assignment) => assignment.id === project.assignmentId)
      return <article className="git-project-card" key={project.id}><div className="git-project-head"><span className="git-project-icon"><Code2 size={19} /></span><span className={`git-project-status status-${project.status}`}>{statusText[project.status]}</span></div><h2>{project.name}</h2><div className="git-stats"><div><span>DERNIER COMMIT</span><strong>{project.lastCommit}</strong></div><div><span>7 DERNIERS JOURS</span><strong>{project.commitsIn7Days} commits</strong></div></div>{project.commitsIn7Days === 0 ? <p className="no-commit">Aucun commit depuis 3 jours.</p> : project.status === 'at_risk' ? <p className="no-commit">Aucun commit depuis 3 jours.</p> : <p className="commit-good"><Check size={13} /> Activité récente</p>}{linked ? <Link to={`/assignments/${linked.id}`} className="linked-assignment"><CourseBadge courseId={linked.courseId} compact /><span>{linked.title}</span><ArrowRight size={14} /></Link> : <span className="muted-small">Aucun devoir lié</span>}</article>
    })}</div>}
  </div>
}

export function HelpPage() {
  return <div className="student-page help-page"><div className="page-heading"><div><span className="eyebrow">TOUJOURS À TES CÔTÉS</span><h1>Comment Sahbi t’aide</h1></div><Mascot size={67} /></div>
    <div className="help-card-grid">
      <article className="help-card"><span className="help-icon"><Sparkles size={19} /></span><h2>Comment ça marche</h2><div className="help-steps"><span><i>1</i>Observer</span><ArrowRight size={13} /><span><i>2</i>Proposer</span><ArrowRight size={13} /><span><i>3</i>Agir avec ton accord</span></div><Mascot size={54} /></article>
      <article className="help-card"><span className="help-icon mint"><ShieldCheck size={19} /></span><h2>Partagé avec l'IA</h2><ul><li>Courts extraits d’emails, sans expéditeur</li><li>Petits passages de tes documents</li><li>Textes de devoirs</li></ul><p className="help-assurance">Jamais un fichier entier. Jamais un jeton.</p></article>
      <article className="help-card"><span className="help-icon coral"><Heart size={19} /></span><h2>Nos garanties</h2><ul><li>Sahbi n’envoie jamais d’email</li><li>Ne supprime jamais tes fichiers</li><li>Ne modifie aucun rendu Classroom</li><li>Ne lance jamais de programme</li></ul></article>
    </div>
    <Link to="/bar" className="help-floating-link"><Sparkles size={15} />Voir la barre</Link>
  </div>
}

export function NotificationsPage() {
  const { notifications } = useStore()
  const [toastId, setToastId] = useState(notifications[0]?.id ?? '')
  const grouped = notifications.reduce<Record<string, typeof notifications>>((groups, notification) => {
    const day = notification.day ?? 'Aujourd’hui'
    groups[day] = [...(groups[day] ?? []), notification]
    return groups
  }, {})
  return <div className="student-page notifications-page"><div className="page-heading"><div><span className="eyebrow">À NE PAS MANQUER</span><h1>Notifications</h1></div><Bell className="heading-sparkle" size={21} /></div>
    <div className="notification-groups">{Object.entries(grouped).map(([day, items]) => <section key={day} className="notification-group"><h2>{day}</h2>{items.map((notification) => {
      const level = notification.level ?? (notification.urgent ? 'urgent' : 'info')
      const Icon = level === 'urgent' ? AlertTriangle : level === 'important' ? Info : Bell
      return <article className={`notification-card level-${level}`} key={notification.id}><span className="notification-icon"><Icon size={16} /></span><div><h3>{notification.title}</h3><p>{notification.detail}</p></div><time>{notification.time}</time></article>
    })}</section>)}</div>
    {notifications.find((notification) => notification.id === toastId) && <div className="notification-toast"><span className={`notification-icon level-icon-${notifications.find((notification) => notification.id === toastId)?.level ?? 'info'}`}><Bell size={15} /></span><div><span>NOUVEAU</span><strong>{notifications.find((notification) => notification.id === toastId)?.title}</strong></div><button type="button" aria-label="Fermer" onClick={() => setToastId('')}><X size={15} /></button></div>}
  </div>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" className={`toggle${checked ? ' on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span /></button>
}

function SettingsCard({ icon: Icon, title, children, accent = '' }: { icon: LucideIcon; title: string; children: ReactNode; accent?: string }) {
  return <section className="settings-card"><div className={`settings-card-icon ${accent}`}><Icon size={18} /></div><div className="settings-card-body"><h2>{title}</h2>{children}</div></section>
}

export function SettingsPage() {
  const store = useStore()
  const {
    profile, updateProfile, sources, toggleSource, connectSource, teachers, addTeacher, removeTeacher,
    allowedFolders, excludedFolders, addAllowedFolder, removeAllowedFolder, addExcludedFolder, removeExcludedFolder,
    autonomy, setAutonomy, notificationPreferences, setNotificationPreference, rememberedProposalKinds,
    removeAlwaysPermission, trackProjects, toggleTrackProjects, paused, togglePause, simulateProblem, clearAllData,
  } = store
  const [name, setName] = useState(profile.name)
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [folderKind, setFolderKind] = useState<'allowed' | 'excluded'>('allowed')
  const [error, setError] = useState('')
  const [dangerOpen, setDangerOpen] = useState(false)
  const [eraseText, setEraseText] = useState('')
  const suggestedFolders = ['D:\\Etudes', 'D:\\Cours', 'D:\\Projets', 'D:\\Etudes\\Personnel']
  const addFolder = () => {
    const list = folderKind === 'allowed' ? allowedFolders : excludedFolders
    const next = suggestedFolders.find((folder) => !list.includes(folder))
    if (!next) return
    if (folderKind === 'allowed') addAllowedFolder(next)
    else addExcludedFolder(next)
  }
  const submitTeacher = (event: FormEvent) => {
    event.preventDefault()
    if (!teacherName.trim() || !teacherEmail.trim().endsWith('@universite.example')) {
      setError('Adresse @universite.example requise.')
      return
    }
    addTeacher(teacherName, teacherEmail)
    setTeacherName('')
    setTeacherEmail('')
    setError('')
  }
  const confirmedErase = () => {
    clearAllData()
    setDangerOpen(false)
    setEraseText('')
    setName('Sara')
  }

  return <div className="student-page settings-page"><div className="page-heading"><div><span className="eyebrow">TON ESPACE, TES RÈGLES</span><h1>Paramètres</h1></div><AvatarBadge avatar={profile.avatar} size={43} /></div>
    <div className="settings-grid">
      <SettingsCard icon={UserRound} title="Mon profil"><div className="settings-profile-row"><AvatarBadge avatar={profile.avatar} size={52} /><label className="settings-name-field">Prénom<input value={name} maxLength={28} onChange={(event) => setName(event.target.value)} onBlur={() => updateProfile(name, profile.avatar)} /></label></div><div className="settings-avatar-row">{avatarOptions.map((option) => <button type="button" className={`settings-avatar-choice${profile.avatar === option.id ? ' chosen' : ''}`} key={option.id} aria-label={`Choisir ${option.id}`} onClick={() => updateProfile(name, option.id)}><AvatarBadge avatar={option.id} size={31} /></button>)}</div></SettingsCard>
      <SettingsCard icon={Sparkles} title="Sources" accent="violet">{sources.map((source) => <div className="setting-source" key={source.id}><span className={`setting-source-dot source-${source.status}`} /><span>{sourceNames[source.id]}</span><button type="button" className="setting-text-button" onClick={() => source.status === 'disconnected' ? connectSource(source.id) : toggleSource(source.id)}>{source.status === 'disconnected' ? 'Connecter' : 'Déconnecter'}</button></div>)}<details className="demo-tools"><summary>Outils de démo</summary><button type="button" onClick={() => simulateProblem('gmail')}><AlertTriangle size={13} />Simuler un problème</button></details></SettingsCard>
      <SettingsCard icon={Mail} title="Enseignants" accent="coral"><form className="settings-teacher-form" onSubmit={submitTeacher}><input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Nom" aria-label="Nom de l’enseignant" /><input value={teacherEmail} onChange={(event) => setTeacherEmail(event.target.value)} placeholder="nom@universite.example" aria-label="Email de l’enseignant" type="email" /><button type="submit" aria-label="Ajouter un enseignant"><Plus size={16} /></button></form>{error && <span className="form-error">{error}</span>}<div className="settings-teacher-list">{teachers.map((teacher: Teacher) => <div className="teacher-setting-row" key={teacher.id}><span><strong>{teacher.name}</strong><small>{teacher.email}</small></span><button type="button" aria-label={`Retirer ${teacher.name}`} onClick={() => removeTeacher(teacher.id)}><X size={14} /></button></div>)}</div></SettingsCard>
      <SettingsCard icon={FolderOpen} title="Dossiers autorisés et exclus" accent="mint"><div className="folder-tabs"><button type="button" className={folderKind === 'allowed' ? 'selected' : ''} onClick={() => setFolderKind('allowed')}>Autorisés</button><button type="button" className={folderKind === 'excluded' ? 'selected' : ''} onClick={() => setFolderKind('excluded')}>Exclus</button></div><div className="settings-folder-list">{(folderKind === 'allowed' ? allowedFolders : excludedFolders).map((folder) => <div key={folder}><Folder size={14} /><span>{folder}</span><button type="button" aria-label={`Retirer ${folder}`} onClick={() => folderKind === 'allowed' ? removeAllowedFolder(folder) : removeExcludedFolder(folder)}><X size={13} /></button></div>)}</div><button type="button" className="settings-add-link" onClick={addFolder}><Plus size={14} />Ajouter un dossier</button></SettingsCard>
      <SettingsCard icon={ShieldCheck} title="Autonomie" accent="violet"><div className="autonomy-options">{([{ id: 'read_only', title: 'Lecture seule', detail: 'Observer, sans agir' }, { id: 'propose', title: 'Je propose', detail: 'Te demander avant chaque action' }, { id: 'approval', title: 'J’agis après accord', detail: 'Tes accords, tes règles' }] as const).map((option) => <button type="button" key={option.id} className={`autonomy-option${autonomy === option.id ? ' selected' : ''}`} onClick={() => setAutonomy(option.id)}><span className="radio-dot" /><span><strong>{option.title}</strong><small>{option.detail}</small></span></button>)}</div></SettingsCard>
      <SettingsCard icon={Bell} title="Notifications" accent="coral">{([{ key: 'reminders' as const, label: 'Rappels de devoirs', icon: Clock3 }, { key: 'quietHours' as const, label: 'Heures calmes', icon: Moon }, { key: 'morningSummary' as const, label: 'Résumé du matin', icon: Sun }]).map(({ key, label, icon: Icon }) => <div className="preference-row" key={key}><Icon size={16} /><span>{label}</span><Toggle label={label} checked={notificationPreferences[key]} onChange={() => setNotificationPreference(key, !notificationPreferences[key])} /></div>)}</SettingsCard>
      <SettingsCard icon={Check} title="Autorisations « Toujours »" accent="mint">{rememberedProposalKinds.length ? rememberedProposalKinds.map((kind) => <div className="always-row" key={kind}><span>{kind === 'create_assignment_folder' ? 'Créer un dossier de devoir' : 'Réserver un créneau'}</span><button type="button" onClick={() => removeAlwaysPermission(kind)}>Retirer</button></div>) : <p className="settings-muted">Aucune autorisation permanente.</p>}</SettingsCard>
      <SettingsCard icon={GitBranch} title="Projets Git"><div className="preference-row"><span>Suivre mes projets</span><Toggle label="Suivre mes projets" checked={trackProjects} onChange={toggleTrackProjects} /></div></SettingsCard>
      <SettingsCard icon={paused ? Play : Pause} title="Pause Sahbi"><div className="preference-row"><span>{paused ? 'Sahbi est en pause' : 'Mettre Sahbi en pause'}</span><Toggle label="Pause Sahbi" checked={paused} onChange={togglePause} /></div></SettingsCard>
    </div>
    <details className="danger-zone"><summary><Trash2 size={16} />Effacer toutes mes données</summary><div><p>Cette action réinitialise les données locales de la maquette.</p><button type="button" className="danger-button" onClick={() => setDangerOpen(true)}>Continuer</button></div></details>
    {dangerOpen && <div className="modal-backdrop" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="erase-title"><button type="button" className="dialog-close" aria-label="Fermer" onClick={() => setDangerOpen(false)}><X size={18} /></button><span className="danger-icon"><AlertTriangle size={22} /></span><h2 id="erase-title">Effacer toutes tes données ?</h2><p>Pour confirmer, saisis ERASE.</p><input autoFocus value={eraseText} onChange={(event) => setEraseText(event.target.value)} aria-label="Saisir ERASE" /><div><button type="button" className="button-secondary" onClick={() => setDangerOpen(false)}>Annuler</button><button type="button" className="danger-button" disabled={eraseText !== 'ERASE'} onClick={confirmedErase}>Tout effacer</button></div></section></div>}
  </div>
}
