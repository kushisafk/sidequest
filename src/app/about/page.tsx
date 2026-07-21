export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-pixel text-xl text-amber-400 mb-6 text-center">THE LORE</h1>

      <div className="border-2 border-amber-700 bg-stone-900 p-6 space-y-4">
        <p className="font-mono text-stone-300 leading-relaxed">
          Every developer has a graveyard of unfinished projects. The half-built CRUD app,
          the SaaS that never launched, the game engine that was &ldquo;going to be different.&rdquo;
        </p>
        <p className="font-mono text-stone-300 leading-relaxed">
          SideQuest is a place to lay those projects to rest. Give them a proper burial.
          Write their epitaph. Learn from their failure.
        </p>
        <p className="font-mono text-stone-300 leading-relaxed">
          When enough projects share the same cause of death, the graveyard itself
          generates a <span className="text-amber-400">Party Build</span> — a recommended
          team composition and strategy to actually succeed next time.
        </p>
        <p className="font-mono text-stone-400 text-base pt-4 border-t border-stone-700">
          Built with ❤ for every dev who&apos;s ever abandoned a repo.
        </p>
      </div>
    </div>
  )
}
