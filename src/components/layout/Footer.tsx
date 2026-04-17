export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-fg sm:flex-row">
        <p>
          Balcão dos Funis · feito para alunos de{" "}
          <span className="text-secondary-fg">Método LTV · CAIA · AI Society</span>
        </p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
