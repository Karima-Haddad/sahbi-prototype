import { ArrowRight, Check, ChevronDown, CircleDot, Pause, Play, Search, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { Mascot, StatusDot } from './common'

export function FloatingBarPage() {
  const { sources, paused, togglePause, trackProjects, proposals, accept, postpone } = useStore()
  const [proposalOpen, setProposalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const visibleSources = sources.filter((source) => source.id !== 'git' || trackProjects)
  const proposal = proposals.find((item) => item.status === 'pending')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate('/search', { state: { query: query.trim() } })
  }
  return (
    <div className="floating-page student-page">
      <div className="page-heading"><div><span className="eyebrow">SAHBI, TOUT PRÈS</span><h1>La barre flottante</h1></div><span className="floating-live"><CircleDot size={11} /> Aperçu</span></div>
      <div className="floating-stage">
        <div className="floating-window">
          <div className="floating-bar">
            <button type="button" className="floating-mascot" aria-label="Mascotte Sahbi"><Mascot size={36} /></button>
            <div className="floating-dots">{visibleSources.map((source) => <StatusDot key={source.id} status={source.status} label={source.name} paused={paused} />)}</div>
            <button type="button" className={`floating-proposals${proposalOpen ? ' selected' : ''}`} aria-label="Propositions en attente" title="Propositions en attente" onClick={() => setProposalOpen((value) => !value)}>
              <Sparkles size={17} />
              {proposals.filter((item) => item.status === 'pending').length > 0 && <span>{proposals.filter((item) => item.status === 'pending').length}</span>}
            </button>
            <form className="floating-search" onSubmit={submit}>
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Demander à Sahbi…" aria-label="Demander à Sahbi" />
              <button type="submit" aria-label="Rechercher"><ArrowRight size={14} /></button>
            </form>
            <button type="button" className={`floating-pause${paused ? ' selected' : ''}`} onClick={togglePause} aria-label={paused ? 'Reprendre Sahbi' : 'Mettre Sahbi en pause'} title={paused ? 'Reprendre Sahbi' : 'Pause'}>
              {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
            </button>
            <button type="button" className="floating-open" onClick={() => navigate('/')} aria-label="Ouvrir Sahbi" title="Ouvrir Sahbi"><span className="sr-only">Ouvrir Sahbi</span><ArrowRight size={16} /></button>
          </div>
          {proposalOpen && <div className="floating-proposal-card">
            <div className="floating-proposal-heading"><span><Sparkles size={14} /> PROPOSITION</span><button type="button" onClick={() => setProposalOpen(false)} aria-label="Fermer"><ChevronDown size={16} /></button></div>
            {proposal ? <>
              <strong>{proposal.title}</strong>
              <p>{proposal.reason}</p>
              <div><button type="button" className="button-primary small" onClick={() => { accept(proposal.id); setProposalOpen(false) }}><Check size={13} />Accepter</button><button type="button" className="button-secondary small" onClick={() => { postpone(proposal.id, 'Demain'); setProposalOpen(false) }}>Plus tard</button></div>
            </> : <p>Aucune proposition en attente.</p>}
          </div>}
        </div>
        <span className="floating-caption">Un petit compagnon, accessible depuis ton bureau.</span>
      </div>
    </div>
  )
}
