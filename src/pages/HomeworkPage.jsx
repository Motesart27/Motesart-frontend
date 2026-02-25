import Layout from '../components/Layout.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function HomeworkPage() {
  return (
    <Layout>
      <div className="px-4 pt-6 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold animate-fade-up">📝 Homework</h1>
        <GlassCard className="animate-fade-up animate-delay-100">
          <p className="text-white/30 text-center text-sm py-16">
            Homework assignments, submissions, filters
          </p>
        </GlassCard>
      </div>
    </Layout>
  )
}
