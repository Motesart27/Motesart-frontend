import { useAuth } from '../context/AuthContext.jsx'

export default function AdminBanner() {
  const { isAdmin } = useAuth()
  if (!isAdmin()) return null

  return (
    <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-center text-xs font-semibold py-2 px-4">
      👁️ Viewing as Admin (Read Only)
    </div>
  )
}
