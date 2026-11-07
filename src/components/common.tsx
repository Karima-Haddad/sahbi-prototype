import { BookOpen, Check, Code2, Coffee, Heart, Leaf, Moon, Rocket, Smile, Sparkles, Star, Sun, Pause } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import type { CourseId, SourceStatus } from '../data'
import { avatarOptions, courses } from '../data'

const avatarIcons = { sparkles: Sparkles, smile: Smile, code: Code2, star: Star, heart: Heart, rocket: Rocket, leaf: Leaf, coffee: Coffee, moon: Moon, sun: Sun }

export function AvatarBadge({ avatar, size = 38 }: { avatar: string; size?: number }) {
  const option = avatarOptions.find((item) => item.id === avatar)
  const Icon = option ? avatarIcons[option.id as keyof typeof avatarIcons] : null
  return <span className="avatar" style={{ width: size, height: size, backgroundColor: option?.color ?? '#EAE6FF' }}>{Icon ? <Icon size={Math.round(size * .47)} strokeWidth={2.2} /> : avatar || <BookOpen size={16} />}</span>
}

export function Mascot({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Mascotte Sahbi">
      <path d="M17 53c0-22 14-38 34-38 22 0 35 17 35 39 0 19-14 32-35 32S17 74 17 53Z" fill="#A99EFF" />
      <path d="M17 53c-8-4-10-1-8 7 1 4 4 7 10 5m67-10c8-4 10-1 8 7-1 4-4 7-10 5" fill="none" stroke="#8B7CFF" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="39" cy="51" rx="3" ry="4" fill="#1F1B2E" /><ellipse cx="63" cy="51" rx="3" ry="4" fill="#1F1B2E" />
      <path d="M43 63c5 5 11 5 16 0" fill="none" stroke="#1F1B2E" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="28" cy="61" r="4" fill="#F6A2B6" opacity=".8" /><circle cx="74" cy="61" r="4" fill="#F6A2B6" opacity=".8" />
      <path d="M45 15c2-7 6-10 11-11" fill="none" stroke="#8B7CFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="4" r="3" fill="#FF7A6B" />
    </svg>
  )
}

export function StatusDot({ status, label, paused = false, onClick }: { status: SourceStatus; label: string; paused?: boolean; onClick?: () => void }) {
  const actualStatus = paused ? 'paused' : status
  const title = `${label} · ${actualStatus === 'ok' ? 'Connecté' : actualStatus === 'syncing' ? 'Synchronisation' : actualStatus === 'problem' ? 'Problème' : actualStatus === 'disconnected' ? 'Déconnecté' : 'En pause'}`
  return (
    <button className={`source-dot source-${actualStatus}`} title={title} aria-label={title} onClick={onClick} type="button">
      {actualStatus === 'paused' && <Pause size={9} strokeWidth={3} />}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export function CourseBadge({ courseId, compact = false }: { courseId: CourseId; compact?: boolean }) {
  const course = courses.find((item) => item.id === courseId)!
  return <span className={`course-badge${compact ? ' course-badge-compact' : ''}`} style={{ '--course': course.color, '--course-soft': course.softColor } as CSSProperties}>{!compact && <i />}<span>{compact ? course.name.slice(0, 1) : course.name}</span></span>
}

export function ProgressRing({ value, label, color = '#6D5DFB' }: { value: number; label: string; color?: string }) {
  const progress = Math.max(0, Math.min(1, value))
  const circumference = 2 * Math.PI * 27
  return (
    <div className="progress-ring" aria-label={label}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="27" className="ring-track" />
        <circle cx="32" cy="32" r="27" className="ring-value" style={{ stroke: color, strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress) }} />
      </svg>
      <span>{label}</span>
    </div>
  )
}

export function SectionCard({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <section className={`section-card ${className}`}><h2>{title}</h2>{children}</section>
}

export function EmptyState({ title = 'Bientôt', detail = 'Cette page arrive bientôt.' }: { title?: string; detail?: string }) {
  return <div className="empty-state"><Mascot size={92} /><strong>{title}</strong><span>{detail}</span></div>
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="toast"><span className="toast-check"><Check size={16} /></span><span>{message}</span><button type="button" aria-label="Fermer" onClick={onClose}>×</button></div>
}
