import Layout from '../components/Layout.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function SettingsPage() {
  return (
    <Layout>
      <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-up">
          <h1 className="text-2xl font-bold">⚙️ Settings</h1>
          <button className="text-red-400 text-sm font-medium hover:text-red-300 transition">Logout</button>
        </div>
        <GlassCard className="animate-fade-up animate-delay-100">
          <p className="text-white/30 text-center text-sm py-16">
            Profile, password, preferences
          </p>
        </GlassCard>
      </div>
    </Layout>
  )
}
