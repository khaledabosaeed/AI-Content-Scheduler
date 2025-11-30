export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-t border-white/20 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-3 px-6 py-3">
        <p className="text-sm">
          © {new Date().getFullYear()} AI Content Scheduler — All rights reserved.
        </p>

      </div>
    </footer>
  );
}
