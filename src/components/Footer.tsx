
export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
          © {new Date().getFullYear()} XDesign. جميع الحقوق محفوظة.
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          تطوير{" "}
          <a
            href="https://ahjbu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Ahjbu
          </a>
        </p>
      </div>
    </footer>
  );
}
