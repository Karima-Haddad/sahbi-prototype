import { Pause, Play, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../useStore'
import { StatusDot } from './common'

export function TopBar() {
  const { sources, paused, togglePause, trackProjects, reconnectSource } = useStore()
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  const visibleSources = sources.filter((source) => source.id !== 'git' || trackProjects)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate('/search', { state: { query: query.trim() } })
  }

  return (
    <>
      <header className="topbar">
        <form className="search-field" onSubmit={submit}>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans mes documents…" aria-label="Rechercher dans mes documents" />
          <kbd>↵</kbd>
        </form>
        <div className="source-list">
          {visibleSources.map((source) => (
            <StatusDot key={source.id} status={source.status} label={source.name} paused={paused}
              onClick={() => {
                if (source.status === 'problem' || source.status === 'disconnected') setToast(source.name)
              }} />
          ))}
        </div>
        <button className={`pause-button${paused ? ' is-paused' : ''}`} type="button" onClick={togglePause} title={paused ? 'Reprendre Sahbi' : 'Mettre Sahbi en pause'}>
          {paused ? <Play size={15} fill="currentColor" /> : <Pause size={15} fill="currentColor" />}
          <span>{paused ? 'Reprendre' : 'Pause'}</span>
        </button>
      </header>
      {paused && <div className="pause-banner"><span /> Sahbi est en pause</div>}
      {toast && <div className="toast-wrap"><div className="connection-toast"><div><strong>{toast}</strong><span>La connexion nécessite votre attention.</span></div><button type="button" onClick={() => { reconnectSource(sources.find((source) => source.name === toast)!.id); setToast('') }}>Me reconnecter</button><button type="button" className="toast-dismiss" aria-label="Fermer" onClick={() => setToast('')}>×</button></div></div>}
    </>
  )
}
