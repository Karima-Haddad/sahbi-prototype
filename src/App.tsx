import { ArrowRight, Check, FolderOpen, Mail, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { assignments, calendarEvents, courses, emails, projects } from './data'
import { useStore } from './useStore'
import { CourseBadge, EmptyState, Mascot, ProgressRing, SectionCard, Toast } from './components/common'
import { AssignmentDetailPage, AssignmentsPage, JournalPage, ProposalsPage } from './components/StudentPages'
import { CalendarPage, EmailsPage, HelpPage, NotificationsPage, PlanningPage, ProjectsPage, SearchPage, SettingsPage, WelcomePage } from './components/ApplicationPages'
import { FloatingBarPage } from './components/FloatingBarPage'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'

function Workspace() {
  const { setupCompleted } = useStore()
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <TopBar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={setupCompleted ? <HomePage /> : <Navigate to="/welcome" replace />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/emails" element={<EmailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<ComingPage title="Bientôt" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function ComingPage({ title }: { title: string }) {
  return <div className="coming-page"><div className="page-heading"><span className="eyebrow">SAHBI</span><h1>{title}</h1></div><EmptyState /></div>
}

function HomePage() {
  const { proposals, profile, accept, postpone, trackProjects, openedAssignmentIds, markAssignmentOpened } = useStore()
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  const proposal = proposals.find((item) => item.status === 'pending')
  const upcoming = assignments.filter((item) => item.dueInDays !== null && item.dueInDays >= 0 && !['submitted', 'late'].includes(item.status))
    .sort((a, b) => a.dueInDays! - b.dueInDays!).slice(0, 3)
  const todayEvents = calendarEvents.filter((event) => event.date === 'Aujourd’hui').slice(0, 2)
  const latestEmail = emails[0]
  const courseFor = (id: string) => courses.find((course) => course.id === id)!

  return (
    <div className="home-page">
      <div className="page-heading home-heading"><div><span className="eyebrow">VOTRE ESPACE ÉTUDIANT</span><h1>Votre journée, en bref</h1></div><Link to="/notifications" className="icon-soft" aria-label="Notifications"><Sparkles size={18} /></Link></div>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">VOTRE COMPAGNON ÉTUDIANT</span>
          <h2>Bonjour {profile.name} <span aria-hidden="true">👋</span></h2>
          {proposal ? <>
            <p className="hero-proposal-label">Une idée pour vous</p>
            <button type="button" className="hero-proposal-title" onClick={() => navigate('/proposals')}>{proposal.title}<ArrowRight size={17} /></button>
            <p className="hero-reason">{proposal.reason}</p>
            <div className="hero-actions">
              <button type="button" className="hero-accept" onClick={() => { accept(proposal.id); setToast('Proposition acceptée') }}><Check size={16} /> Accepter</button>
              <button type="button" className="hero-later" onClick={() => { postpone(proposal.id, 'Demain'); setToast('Proposition reportée') }}>Plus tard</button>
            </div>
          </> : <p className="hero-reason">Tout est sous contrôle. Belle journée !</p>}
        </div>
        <div className="hero-mascot"><span className="mascot-sparkle">✦</span><Mascot size={130} /></div>
        <div className="hero-glow" />
      </section>

      <section className="assignment-zone">
        <div className="section-title-row"><div><span className="eyebrow">À GARDER EN VUE</span><h2>Vos prochains devoirs</h2></div><Link to="/assignments" className="text-link">Tout voir <ArrowRight size={15} /></Link></div>
        <div className="assignment-grid">
          {upcoming.map((assignment) => {
            const course = courseFor(assignment.courseId)
            const isNew = assignment.status === 'new' && !openedAssignmentIds.includes(assignment.id)
            return (
              <Link to={`/assignments/${assignment.id}`} className="assignment-card" key={assignment.id} onClick={() => markAssignmentOpened(assignment.id)}>
                <span className="assignment-strip" style={{ backgroundColor: course.color }} />
                <div className="assignment-top"><CourseBadge courseId={assignment.courseId} compact /><div className="assignment-badges">{isNew && <span className="tag tag-new">Nouveau</span>}{assignment.status === 'urgent' && <span className="tag tag-urgent">Urgent</span>}</div></div>
                <h3>{assignment.title}</h3>
                <div className="assignment-bottom"><span className="due-copy">{assignment.dueLabel}</span><ProgressRing value={1 - Math.min(assignment.dueInDays ?? 0, 10) / 12} label={`${assignment.dueInDays} j`} color={course.color} /></div>
              </Link>
            )
          })}
        </div>
      </section>

      <div className={`bottom-grid${trackProjects ? ' with-projects' : ''}`}>
        <SectionCard title="Aujourd’hui" className="today-card">
          {todayEvents.map((event) => <div className="mini-row" key={event.id}><CourseBadge courseId={event.courseId} compact /><strong>{event.title}</strong><time>{event.time}</time></div>)}
          <Link to="/calendar" className="card-link">Voir l’agenda <ArrowRight size={14} /></Link>
        </SectionCard>
        <SectionCard title="Emails" className="email-card">
          <div className="email-count"><span className="email-icon"><Mail size={17} /></span><strong>{emails.length}</strong><span>à lire</span></div>
          <div className="latest-email"><CourseBadge courseId={latestEmail.courseId} compact /><div><strong>{latestEmail.subject}</strong><span>{latestEmail.name} · {latestEmail.received}</span></div></div>
          <Link to="/emails" className="card-link">Voir les emails <ArrowRight size={14} /></Link>
        </SectionCard>
        {trackProjects && <SectionCard title="Projets" className="projects-card">
          <div className="project-preview"><span className="project-icon"><FolderOpen size={17} /></span><div><strong>{projects[0].name}</strong><span>{projects[0].commitsIn7Days} commits cette semaine</span></div><span className="project-status" title="En bonne voie" /></div>
          <Link to="/projects" className="card-link">Voir les projets <ArrowRight size={14} /></Link>
        </SectionCard>}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default function App() {
  return <BrowserRouter><Routes><Route path="/welcome" element={<WelcomePage />} /><Route path="/bar" element={<FloatingBarPage />} /><Route path="/*" element={<Workspace />} /></Routes></BrowserRouter>
}
