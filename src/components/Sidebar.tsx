import { CalendarDays, CircleHelp, ClipboardList, Home, Mail, Search, Settings, ScrollText, Sparkles, FolderGit2, Bell } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../useStore'
import { AvatarBadge } from './common'

const mainLinks = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/assignments', label: 'Devoirs', icon: ClipboardList },
  { to: '/calendar', label: 'Agenda', icon: CalendarDays },
  { to: '/emails', label: 'Emails', icon: Mail },
  { to: '/search', label: 'Recherche', icon: Search },
  { to: '/proposals', label: 'Propositions', icon: Sparkles, badge: true },
  { to: '/journal', label: 'Journal', icon: ScrollText },
]

export function Sidebar() {
  const { proposals, profile, trackProjects } = useStore()
  const links = trackProjects ? [...mainLinks, { to: '/projects', label: 'Projets', icon: FolderGit2 }] : mainLinks
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand-mark" title="Sahbi" aria-label="Sahbi"><span>s</span></NavLink>
      <nav className="side-nav" aria-label="Navigation principale">
        {links.map(({ to, label, icon: Icon, ...item }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} title={label} aria-label={label}>
            <Icon size={20} strokeWidth={1.9} />
            {item.badge && proposals.filter((proposal) => proposal.status === 'pending').length > 0 && <span className="nav-badge">{proposals.filter((proposal) => proposal.status === 'pending').length}</span>}
            <span className="nav-tooltip">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="side-bottom">
        <NavLink to="/notifications" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} title="Notifications" aria-label="Notifications"><Bell size={19} /><span className="nav-tooltip">Notifications</span></NavLink>
        <NavLink to="/settings" className="profile-link" title={profile.name} aria-label={`Profil de ${profile.name}`}><AvatarBadge avatar={profile.avatar} size={37} /><span className="nav-tooltip">Profil · {profile.name}</span></NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} title="Paramètres" aria-label="Paramètres"><Settings size={19} /><span className="nav-tooltip">Paramètres</span></NavLink>
        <NavLink to="/help" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} title="Aide" aria-label="Aide"><CircleHelp size={19} /><span className="nav-tooltip">Aide</span></NavLink>
      </div>
    </aside>
  )
}
