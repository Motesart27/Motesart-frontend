import Layout from '../components/Layout.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function PracticePage() {
  const { role } = useAuth()
  return (
    <Layout>
      <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold animate-fade-up">📈 Practice Tracking</h1>
        <GlassCard className="animate-fade-up animate-delay-100">
          <p className="text-white/30 text-center text-sm py-16">
            Practice logs, weekly chart, session history
            {role === 'User' && <><br /><span className="text-[10px]">Self-logged sessions</span></>}
          </p>
        </GlassCard>
      </div>
    </Layout>
  )
}
