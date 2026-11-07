import {
  ArrowLeft, ArrowRight, BookOpen, CalendarClock, CalendarDays, Check, ChevronDown, CircleHelp,
  Clock3, FileText, Folder, FolderOpen, Info, Mail, MoreHorizontal, RotateCcw, Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { assignments, courses, emails, type Assignment, type Proposal } from '../data'
import { useStore } from '../useStore'
import { CourseBadge, EmptyState, ProgressRing, Toast } from './common'

type AssignmentFilter = 'todo' | 'submitted' | 'late'

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const { openedAssignmentIds, markAssignmentOpened, completedAssignmentIds } = useStore()
  const course = courses.find((item) => item.id === assignment.courseId)!
  const isNew = assignment.status === 'new' && !openedAssignmentIds.includes(assignment.id)
  const isComplete = completedAssignmentIds.includes(assignment.id) || assignment.status === 'submitted'
  const ringLabel = assignment.dueInDays === null ? '—' : assignment.dueInDays < 0 ? '−' : `${assignment.dueInDays} j`
  return (
    <Link to={`/assignments/${assignment.id}`} className="assignment-card assignment-page-card" onClick={() => markAssignmentOpened(assignment.id)}>
      <span className="assignment-strip" style={{ backgroundColor: course.color }} />
      <div className="assignment-top"><CourseBadge courseId={assignment.courseId} /><div className="assignment-badges">
        {isNew && <span className="tag tag-new">Nouveau</span>}
        {assignment.status === 'urgent' && <span className="tag tag-urgent">Urgent</span>}
        {assignment.dateModified && <span className="tag tag-modified">Date modifiée</span>}
        {isComplete && <span className="tag tag-done">Rendu</span>}
        {completedAssignmentIds.includes(assignment.id) && <span className="tag tag-done">Terminé</span>}
      </div></div>
      <h3>{assignment.title}</h3>
      <p className="assignment-description">{assignment.description}</p>
      <div className="assignment-bottom"><span className="due-copy">{assignment.dueLabel}</span><ProgressRing value={assignment.dueInDays === null ? 0 : assignment.dueInDays <= 0 ? 1 : 1 - Math.min(assignment.dueInDays, 12) / 14} label={ringLabel} color={course.color} /></div>
    </Link>
  )
}

export function AssignmentsPage() {
  const [filter, setFilter] = useState<AssignmentFilter>('todo')
  const { completedAssignmentIds } = useStore()
  const filters = [
    { id: 'todo' as const, label: 'À faire', icon: BookOpen },
    { id: 'submitted' as const, label: 'Rendus', icon: Check },
    { id: 'late' as const, label: 'En retard', icon: Clock3 },
  ]
  const filtered = assignments.filter((assignment) => {
    if (filter === 'late') return assignment.status === 'late'
    if (filter === 'submitted') return assignment.status === 'submitted' || completedAssignmentIds.includes(assignment.id)
    return !['late', 'submitted'].includes(assignment.status) && !completedAssignmentIds.includes(assignment.id)
  }).sort((a, b) => (a.dueInDays ?? Infinity) - (b.dueInDays ?? Infinity))
  return (
    <div className="student-page">
      <div className="page-heading"><div><span className="eyebrow">VOTRE SEMESTRE</span><h1>Devoirs</h1></div><span className="page-count">{filtered.length} devoirs</span></div>
      <div className="filter-chips" role="tablist" aria-label="Filtrer les devoirs">
        {filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={filter === id} className={`filter-chip${filter === id ? ' selected' : ''}`} onClick={() => setFilter(id)}><Icon size={15} />{label}</button>)}
      </div>
      {filtered.length ? <div className="assignment-grid assignment-page-grid">{filtered.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)}</div> : <EmptyState title={filter === 'late' ? 'Aucun retard' : 'Tout est à jour !'} detail="Profitez-en pour souffler." />}
    </div>
  )
}

function Accordion({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: LucideIcon; children: ReactNode; defaultOpen?: boolean }) {
  return <details className="detail-accordion" open={defaultOpen}><summary><span className="accordion-icon"><Icon size={18} /></span><strong>{title}</strong><ChevronDown size={16} className="accordion-chevron" /></summary><div className="accordion-content">{children}</div></details>
}

export function AssignmentDetailPage() {
  const { id = '' } = useParams()
  const assignment = assignments.find((item) => item.id === id)
  const { openedAssignmentIds, markAssignmentOpened, markAssignmentCompleted, completedAssignmentIds } = useStore()
  const [toast, setToast] = useState('')
  const [folderPicker, setFolderPicker] = useState(false)
  const [folder, setFolder] = useState(assignment?.folder ?? 'D:\\Etudes')
  const [confirmed, setConfirmed] = useState(false)
  useEffect(() => {
    if (assignment && !openedAssignmentIds.includes(assignment.id)) markAssignmentOpened(assignment.id)
  }, [assignment, openedAssignmentIds, markAssignmentOpened])
  if (!assignment) return <div className="student-page"><Link to="/assignments" className="back-link"><ArrowLeft size={16} /> Devoirs</Link><EmptyState title="Devoir introuvable" /></div>
  const course = courses.find((item) => item.id === assignment.courseId)!
  const slots = assignment.id === 'tp3-reseaux' ? ['Aujourd’hui · 16 h', 'Demain · 10 h'] : ['Demain · 10 h', 'Demain · 14 h']
  const dueLabel = assignment.dueInDays === null ? 'Sans date' : assignment.dueInDays < 0 ? 'En retard' : assignment.dueInDays === 0 ? 'Aujourd’hui' : `${assignment.dueInDays} jours`

  return (
    <div className="student-page detail-page">
      <Link to="/assignments" className="back-link"><ArrowLeft size={16} /> Tous les devoirs</Link>
      <div className="detail-hero">
        <div className="detail-title"><CourseBadge courseId={assignment.courseId} /><h1>{assignment.title}</h1><p>{assignment.description}</p></div>
        <div className="detail-countdown"><ProgressRing value={assignment.dueInDays === null ? 0 : Math.max(0, 1 - Math.max(assignment.dueInDays, 0) / 14)} label={assignment.dueInDays === null ? '—' : assignment.dueInDays < 0 ? '!' : `${assignment.dueInDays} j`} color={course.color} /><span>{dueLabel}</span></div>
      </div>
      <div className="detail-layout">
        <div className="accordion-stack">
          <Accordion title="Énoncé" icon={BookOpen} defaultOpen><p className="detail-copy">{assignment.description}</p><div className="assignment-meta"><span><CalendarDays size={14} /> À rendre : {assignment.dueLabel}</span>{assignment.projectId && <span><FolderOpen size={14} /> {assignment.projectId}</span>}</div></Accordion>
          <Accordion title="Dossier" icon={Folder}>
            <div className="folder-confidence"><ProgressRing value={assignment.confidence ?? .86} label={`${Math.round((assignment.confidence ?? .86) * 100)} %`} /><div><strong>Association suggérée</strong><span>Confiance de Sahbi</span></div></div>
            <div className="folder-path"><FolderOpen size={16} /><span>{folder}</span></div>
            {folderPicker && <div className="folder-choices">{[assignment.folder ?? 'D:\\Etudes', 'D:\\Cours\\Reseaux', 'D:\\Etudes\\A_trier'].map((path) => <button type="button" key={path} className={folder === path ? 'chosen' : ''} onClick={() => { setFolder(path); setFolderPicker(false) }}>{path}</button>)}</div>}
            <div className="inline-actions"><button type="button" className="button-primary small" onClick={() => { setConfirmed(true); setToast('Dossier confirmé') }}><Check size={14} />{confirmed ? 'Confirmé' : 'Confirmer'}</button><button type="button" className="button-secondary small" onClick={() => setFolderPicker((value) => !value)}>Autre dossier</button></div>
          </Accordion>
          <Accordion title="Documents" icon={FileText}>
            <div className="document-list">{assignment.documents.map((document) => <button type="button" className="document-row" key={document.name} onClick={() => setToast(`${document.name}${document.page ? ` · page ${document.page}` : ''}`)}><span className="document-icon"><FileText size={16} /></span><span><strong>{document.name}</strong><small>{document.page ? `Page ${document.page}` : 'Document associé'}</small></span><ArrowRight size={15} /></button>)}</div>
          </Accordion>
          <Accordion title="Créneaux" icon={CalendarClock}>
            <p className="slot-estimate"><Clock3 size={15} /> Estimation : <strong>{assignment.id === 'tp3-reseaux' ? 4 : 2} h</strong></p>
            <div className="slot-list">{slots.map((slot) => <div className="slot-row" key={slot}><span>{slot}</span><button type="button" className="button-secondary small" onClick={() => setToast(`Créneau proposé : ${slot}`)}>Réserver</button></div>)}</div>
          </Accordion>
        </div>
        <aside className="detail-side">
          <div className="related-card"><h2><Mail size={16} /> Emails liés</h2>{emails.filter((email) => assignment.relatedEmailIds.includes(email.id)).map((email) => <Link className="email-chip" to="/emails" key={email.id}><CourseBadge courseId={email.courseId} compact /><span>{email.subject}</span><ArrowRight size={13} /></Link>)}{assignment.relatedEmailIds.length === 0 && <span className="muted-small">Aucun email lié</span>}</div>
          <Link className="planning-link" to="/planning" state={{ assignmentId: assignment.id }}><CalendarClock size={17} /><span><strong>Planifier ce devoir</strong><small>Choisir un moment pour avancer</small></span><ArrowRight size={15} /></Link>
          <div className="complete-block"><button className={`button-primary complete-button${completedAssignmentIds.includes(assignment.id) ? ' completed' : ''}`} type="button" onClick={() => { markAssignmentCompleted(assignment.id); setToast('Devoir marqué comme terminé') }} disabled={completedAssignmentIds.includes(assignment.id)}><Check size={16} />{completedAssignmentIds.includes(assignment.id) ? 'Terminé' : 'Marquer comme terminé'}</button><small>Ne modifie jamais Classroom</small></div>
        </aside>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

function ProposalPreview({ proposal }: { proposal: Proposal }) {
  const assignment = assignments.find((item) => item.id === proposal.assignmentId)
  const folderName = assignment?.title.includes('TP3') ? 'TP3' : assignment?.title ?? 'Devoir'
  return <div className="proposal-preview">
    {proposal.kind === 'create_assignment_folder' ? <>
      <div><Folder size={16} /><span>{folderName}</span></div>
      <div><FileText size={16} /><span>{proposal.copies?.[0] ?? 'Document associé'}</span></div>
      <div><FolderOpen size={16} /><span>{proposal.folder}</span></div>
    </> : <>
      <div><CalendarDays size={16} /><span>{proposal.possibleSlots?.[0] ?? 'Demain · 10 h'}</span></div>
      <div><CalendarDays size={16} /><span>{proposal.possibleSlots?.[1] ?? 'Demain · 14 h'}</span></div>
      <div><Clock3 size={16} /><span>{proposal.estimateHours ?? 2} h estimées</span></div>
    </>}
  </div>
}

export function ProposalsPage() {
  const { proposals, accept, refuse, postpone, always } = useStore()
  const [tab, setTab] = useState<'pending' | 'decided'>('pending')
  const [index, setIndex] = useState(0)
  const [whyOpen, setWhyOpen] = useState(false)
  const [laterOpen, setLaterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const list = proposals.filter((proposal) => tab === 'pending' ? proposal.status === 'pending' : proposal.status !== 'pending')
  const proposal = list.length ? list[index % list.length] : undefined
  const act = (action: () => void, message: string) => {
    action()
    setToast(message === 'Proposition acceptée' || message === 'Toujours activé' ? 'Fait ✓' : message)
    setLaterOpen(false)
    setMenuOpen(false)
  }
  const changeTab = (next: 'pending' | 'decided') => { setTab(next); setIndex(0) }

  return (
    <div className="student-page">
      <div className="page-heading"><div><span className="eyebrow">VOUS GARDEZ LE CONTRÔLE</span><h1>Propositions</h1></div><Sparkles className="heading-sparkle" size={23} /></div>
      <div className="proposal-tabs" role="tablist"><button type="button" role="tab" aria-selected={tab === 'pending'} className={tab === 'pending' ? 'active' : ''} onClick={() => changeTab('pending')}>En attente <span>{proposals.filter((item) => item.status === 'pending').length}</span></button><button type="button" role="tab" aria-selected={tab === 'decided'} className={tab === 'decided' ? 'active' : ''} onClick={() => changeTab('decided')}>Décidées <span>{proposals.filter((item) => item.status !== 'pending').length}</span></button></div>
      {proposal ? <div className="proposal-stage">
        <div className="proposal-stack proposal-stack-back" />
        <article className="proposal-card">
          <div className="proposal-card-top"><span className="proposal-kind"><Sparkles size={14} />{proposal.kind === 'create_assignment_folder' ? 'DOSSIER' : 'ORGANISATION'}</span>{tab === 'pending' && (proposal.kind === 'create_assignment_folder' || proposal.kind === 'book_work_slot') && <div className="proposal-menu-wrap"><button type="button" className="round-icon-button" aria-label="Plus d’options" onClick={() => setMenuOpen((value) => !value)}><MoreHorizontal size={19} /></button>{menuOpen && <div className="proposal-menu"><p>Sahbi le fera sans demander. Vous pourrez annuler.</p><button type="button" onClick={() => act(() => always(proposal.id), 'Toujours activé')}><Check size={14} />Toujours</button></div>}</div>}</div>
          <h2>{proposal.title}</h2>
          <ProposalPreview proposal={proposal} />
          <div className="proposal-why"><button type="button" onClick={() => setWhyOpen((value) => !value)}><Info size={15} />Pourquoi <ChevronDown size={13} /></button><p>{proposal.reason}</p>{whyOpen && <div className="why-detail">Sahbi a relié cette suggestion au devoir <strong>{assignments.find((item) => item.id === proposal.assignmentId)?.title}</strong>. Rien ne sera fait sans votre accord.</div>}</div>
          {tab === 'pending' ? <div className="proposal-actions">
            <div className="proposal-action-row"><button type="button" className="button-primary proposal-accept" onClick={() => act(() => accept(proposal.id), 'Proposition acceptée')}><Check size={16} />Accepter</button><button type="button" className="button-secondary proposal-later" onClick={() => setLaterOpen((value) => !value)}>Plus tard</button></div>
            {laterOpen && <div className="later-choices"><span>Revoir quand ?</span>{['Demain', 'Dans 3 jours'].map((date) => <button type="button" key={date} onClick={() => act(() => postpone(proposal.id, date), `Reportée : ${date.toLowerCase()}`)}>{date}</button>)}</div>}
            <button type="button" className="proposal-refuse" onClick={() => act(() => refuse(proposal.id), 'Proposition refusée')}>Refuser</button>
          </div> : <div className="proposal-decided"><span className={proposal.status === 'accepted' ? 'decided-ok' : proposal.status === 'refused' ? 'decided-no' : 'decided-later'}>{proposal.status === 'accepted' ? 'Acceptée' : proposal.status === 'refused' ? 'Refusée' : `Reportée · ${proposal.postponeUntil ?? 'Plus tard'}`}</span><span>Décision de {proposal.decidedBy ?? 'Vous'}</span></div>}
        </article>
        {list.length > 1 && <div className="proposal-pager"><button type="button" className="round-icon-button" aria-label="Proposition précédente" onClick={() => setIndex((value) => (value + list.length - 1) % list.length)}><ArrowLeft size={16} /></button><span>{index % list.length + 1} / {list.length}</span><button type="button" className="round-icon-button" aria-label="Proposition suivante" onClick={() => setIndex((value) => (value + 1) % list.length)}><ArrowRight size={16} /></button></div>}
      </div> : <EmptyState title={tab === 'pending' ? 'Tout est à jour !' : 'Aucune décision'} detail={tab === 'pending' ? 'Aucune proposition en attente.' : 'Vos décisions apparaîtront ici.'} />}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export function JournalPage() {
  const { journal, undoJournalEntry } = useStore()
  return (
    <div className="student-page journal-page">
      <div className="page-heading"><div><span className="eyebrow">VOS CHOIX, TOUJOURS VISIBLES</span><h1>Journal</h1></div><span className="journal-count">{journal.length} actions</span></div>
      <div className="journal-timeline">
        {journal.map((entry, index) => {
          const Icon = entry.title.toLocaleLowerCase().includes('email') ? Mail : entry.title.toLocaleLowerCase().includes('cours') ? BookOpen : entry.title.toLocaleLowerCase().includes('dossier') ? FolderOpen : Check
          return <article className={`journal-entry${entry.canceled ? ' journal-canceled' : ''}`} key={entry.id}>
            <div className={`journal-icon journal-icon-${index % 4}`}><Icon size={17} /></div>
            <div className="journal-entry-content"><div className="journal-entry-title"><strong>{entry.title}</strong>{entry.canceled && <span className="canceled-label">Annulé</span>}</div><p>{entry.detail}</p><div className="journal-meta"><time>{entry.time}</time><span className="journal-actor">{entry.actor ?? 'Vous'}</span></div></div>
            <button type="button" className={`journal-undo${entry.canceled ? ' undone' : ''}`} title={entry.canceled ? 'Annulé' : 'Annuler'} aria-label={entry.canceled ? 'Annulé' : 'Annuler'} disabled={entry.canceled} onClick={() => undoJournalEntry(entry.id)}>{entry.canceled ? <Check size={15} /> : <RotateCcw size={15} />}</button>
          </article>
        })}
      </div>
      <div className="journal-note"><CircleHelp size={16} /><span>Rien n'est supprimé définitivement : la Corbeille garde les fichiers.</span></div>
    </div>
  )
}
