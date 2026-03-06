export default function WorkingStyle() {
  return (
    <section className="py-24 px-6 md:px-12 border-b border-[var(--color-line)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
            6.0 / Working Style
          </h2>
        </div>
        
        <div className="lg:col-span-8 font-sans text-lg md:text-xl leading-relaxed text-[var(--color-muted)]">
          <p className="mb-8 text-[var(--color-ink)]">
            I am strongest on cross-layer problems that do not fit neatly inside one engineering box.
          </p>
          <p className="mb-8">
            I do my best work when a project requires several types of engineering judgment at once. I am comfortable with architecture, implementation, interface design, systems debugging, interaction refinement, and technical framing in the same problem space. That makes me especially effective on products that are still taking shape, where the hard part is not only execution but figuring out what the system should become.
          </p>
          <p className="mb-8">
            I am particularly drawn to roles where software is moving closer to perception, simulation, intelligent tooling, creative systems, or new computational interfaces. I like environments where engineering is used to expand capability, not just maintain convention.
          </p>
          <p className="text-[var(--color-ink)]">
            I care about systems that are technically serious, operationally useful, and difficult to forget.
          </p>
        </div>
      </div>
    </section>
  );
}
