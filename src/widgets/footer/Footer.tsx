export default function Footer() {
  return (
    <footer
      className="w-full border-t mt-10 transition-colors duration-500"
      style={{
        background: "hsl(var(--accent))",
        color: "#fff",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-3 px-6 py-3">
        <p className="text-sm transition-colors duration-500">
          © {new Date().getFullYear()} AI Content Scheduler — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
