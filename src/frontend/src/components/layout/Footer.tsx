export function Footer() {
  return (
    <footer className="border-t border-surface-300 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-surface-500">
            © 2026 HR Gallery — Library Playground
          </p>
          <div className="flex items-center gap-4">
            <span className="badge-googer">googer 0.2.5</span>
            <span className="badge-f2a">f2a 1.0.3</span>
            <span className="badge-rust">Rust-powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
