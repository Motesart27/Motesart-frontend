import Layout from '../components/Layout.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function GamePage() {
  return (
    <Layout hideNav>
      <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold animate-fade-up">🎮 Find the Note</h1>
        <GlassCard className="animate-fade-up animate-delay-100">
          <p className="text-white/30 text-center text-sm py-16">
            🎵 Game page coming soon...
            <br />
            <span className="text-[10px]">Staff, piano keyboard, lives, streaks</span>
          </p>
        </GlassCard>
      </div>
    </Layout>
  )
}
