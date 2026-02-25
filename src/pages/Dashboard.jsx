import Layout from '../components/Layout.jsx'
import GlassCard from '../components/GlassCard.jsx'
import DpmRing from '../components/DpmRing.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Dashboard() {
  const { user, role } = useAuth()
  const displayName = user?.name || user?.student_user_name || 'Learner'

  return (
    <Layout>
      <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold">Hey {displayName}! 🎶</h1>
          <p className="text-white/40 text-sm mt-1">
            {role === 'Teacher' && '👩‍🏫 Teacher Dashboard'}
            {role === 'Parent' && '👨‍👩‍👧 Parent Dashboard'}
            {role === 'Student' && '🎓 Student • T.A.M.i Dashboard'}
            {role === 'User' && '🎵 Free Learner'}
            {role === 'Admin' && '🔑 Admin View'}
          </p>
        </div>

        {/* DPM Rings — Student/Parent/Teacher/Admin only */}
        {role !== 'User' && (
          <GlassCard className="animate-fade-up animate-delay-100">
            <h2 className="text-sm font-semibold text-white/60 mb-4">DPM Overview</h2>
            <div className="flex justify-around">
              <DpmRing value={72} label="Drive" color="#3b82f6" />
              <DpmRing value={85} label="Passion" color="#f97316" />
              <DpmRing value={58} label="Motivation" color="#22c55e" />
            </div>
          </GlassCard>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up animate-delay-200">
          <GlassCard className="text-center">
            <p className="text-2xl font-bold text-brand-amber">🔥 12</p>
            <p className="text-[10px] text-white/40 mt-1">Day Streak</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-2xl font-bold text-brand-purple">Lv.5</p>
            <p className="text-[10px] text-white/40 mt-1">Game Level</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-2xl font-bold text-brand-teal">8,450</p>
            <p className="text-[10px] text-white/40 mt-1">Total XP</p>
          </GlassCard>
        </div>

        {/* Upgrade CTA — User only */}
        {role === 'User' && (
          <GlassCard glow="purple" className="animate-fade-up animate-delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">🎓 Want a teacher?</p>
                <p className="text-white/40 text-xs mt-1">Get homework, DPM tracking, and more</p>
              </div>
              <button className="btn-purple text-xs py-2 px-4">Join a Class →</button>
            </div>
          </GlassCard>
        )}

        {/* Placeholder sections */}
        <GlassCard className="animate-fade-up animate-delay-400">
          <p className="text-white/30 text-center text-sm py-8">
            📊 Full dashboard content coming soon...
            <br />
            <span className="text-[10px]">XP charts, practice goals, homework, calendar</span>
          </p>
        </GlassCard>
      </div>
    </Layout>
  )
}
