import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { motion as motionPresets } from '@/styles/design-tokens'
import { Button } from '@/components/ui/button'

interface SetupProps {
  onSetupComplete: () => void
}

export default function Setup({ onSetupComplete }: SetupProps) {
  const { t } = useTranslation()
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    window.clawwork.getDefaultWorkspacePath().then(setPath)
  }, [])

  const handleBrowse = async (): Promise<void> => {
    const selected = await window.clawwork.browseWorkspace()
    if (selected) {
      setPath(selected)
      setError('')
    }
  }

  const handleSetup = async (): Promise<void> => {
    if (!path.trim()) {
      setError(t('setup.errSelectDir'))
      return
    }
    setLoading(true)
    setError('')
    const result = await window.clawwork.setupWorkspace(path.trim())
    setLoading(false)
    if (result.ok) {
      onSetupComplete()
    } else {
      setError(result.error ?? t('setup.errInitFailed'))
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <div className="titlebar-drag fixed top-0 left-0 right-0 h-8 z-50" />

      <div className="flex flex-col items-center justify-center w-full px-6">
        <motion.div {...motionPresets.slideUp} className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 scale-[2.5] rounded-full bg-[var(--accent)] opacity-[0.06] blur-2xl" />
              <div className="relative w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center shadow-[var(--glow-accent)]">
                <span className="text-[var(--accent)] text-3xl font-bold tracking-tight">C</span>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
              {t('setup.welcome')}
            </h1>
            <p className="text-[var(--text-muted)] leading-relaxed text-sm">
              {t('setup.desc1')}
              <br />
              {t('setup.desc2')}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow-elevated)] space-y-4">
            <label className="font-medium text-[var(--text-secondary)] text-sm">
              {t('setup.workspaceDir')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={path}
                onChange={(e) => { setPath(e.target.value); setError('') }}
                className={cn(
                  'titlebar-no-drag flex-1 h-10 px-3.5 rounded-lg',
                  'bg-[var(--bg-tertiary)] border border-[var(--border)]',
                  'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                  'outline-none focus:border-[var(--border-accent)] transition-colors',
                )}
                placeholder={t('setup.selectDir')}
              />
              <Button
                variant="outline"
                onClick={handleBrowse}
                className="titlebar-no-drag gap-1.5 h-10"
              >
                <FolderOpen size={15} />
                {t('setup.browse')}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSetup}
            disabled={loading || !path.trim()}
            className="titlebar-no-drag w-full h-11 gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t('setup.initializing')}
              </>
            ) : (
              t('setup.getStarted')
            )}
          </Button>

          {error && (
            <p className="text-sm text-[var(--danger)] text-center">{error}</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
