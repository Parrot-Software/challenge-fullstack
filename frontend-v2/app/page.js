import Login from "@/app/components/Login";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="bg-[#3c3b54] text-white p-4 flex justify-center">
        <h1 className="text-xl font-bold">Parrot</h1>
      </header>
      {/* Main Content */}
      <main className="bg-[#f5f5f5] flex-grow flex items-center justify-center">
        <Login />
      </main>
      {/* Footer */}
      <footer className="bg-[#3c3b54] text-white p-4 flex justify-center">
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
