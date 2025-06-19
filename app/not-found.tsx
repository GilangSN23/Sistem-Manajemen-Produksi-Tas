import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900 p-6">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="w-48 h-auto mb-6 drop-shadow-lg animate-pulse"
      />

      {/* Kode error */}
      <div className="text-6xl font-extrabold text-red-600 mb-4">404</div>

      <h2 className="text-2xl font-semibold mb-8 max-w-xs px-4 text-center">
        Halaman yang kamu cari tidak ditemukan.
      </h2>

      <Link
        href="/Dashboard"
        className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:shadow-xl"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
