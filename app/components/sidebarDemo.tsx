'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function SidebarDemo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Seseorang");

  useEffect(() => {
      const storedName = localStorage.getItem("username");
      if (storedName) {
        setUserName(storedName);
      }
    }, []);

// fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token/session
    router.push("/Login"); // redirect ke login
  };

  const links = [
    {
      label: "Dashboard",
      href: "/Dashboard",
      iconLarge: "/icons/dashboard.svg",
      iconSmall: "/icons/dashboard.svg",
      className: "no-underline",
    },
    {
      label: "Pesanan",
      href: "/Pesanan",
      iconLarge: "/icons/pesanan.svg",
      iconSmall: "/icons/pesanan.svg",
      className: "no-underline",
    },
    {
      label: "Karyawan",
      href: "/Karyawan",
      iconLarge: "/icons/karyawan.svg",
      iconSmall: "/icons/karyawan.svg",
      className: "no-underline",
    },
    {
      label: "Posisi",
      href: "/Posisi",
      iconLarge: "/icons/posisi.svg",
      iconSmall: "/icons/posisi.svg",
      className: "no-underline",
    }
  ];

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar open={open} setOpen={setOpen}>
        <motion.div
          className="h-screen overflow-y-auto bg-neutral-100 dark:bg-neutral-800 p-2 flex flex-col"
          animate={{ width: open ? 250 : 100 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* logo */}
          <div className="flex items-center justify-center mb-6 mt-4" style={{ height: 80, overflow: "visible" }}>
            {open ? (
              <img src="/logo.png" alt="Logo Besar" className="h-12 w-auto" />
            ) : (
              <img src="/logo-kecil.png" alt="Logo Kecil" style={{ height: 60, width: "auto", objectFit: "contain" }} />
            )}
          </div>

          <div className="flex flex-col gap-4 w-full items-center">
            {links.map(({ label, href, iconLarge, iconSmall }, idx) => (
              <Link
                key={idx}
                href={href}
                className={`group flex items-center rounded-md transition-all duration-200 w-full no-underline ${
                  open ? 'justify-start gap-3 px-6 py-2' : 'justify-center p-2'
                }`}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = 'rgba(43, 127, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = '';
                }}
              >
                {open ? (
                  <div className="flex items-center gap-3 w-full">
                    <img src={iconLarge} alt={label} className="h-6 w-6 object-contain" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <img src={iconSmall} alt={label} className="h-6 w-6 object-contain" />
                  </div>
                )}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`group flex items-center rounded-md transition-all duration-200 w-full no-underline ${
                open ? 'justify-start gap-3 px-6 py-2 text-red-600' : 'justify-center p-2'
              }`}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = '';
              }}
            >
              {open ? (
                <div className="flex items-center gap-3 w-full">
                  <img src="/icons/logout.svg" alt="Logout" className="h-6 w-6 object-contain" />
                  <span className="text-sm font-medium text-red-600">Logout</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <img src="/icons/logout.svg" alt="Logout" className="h-6 w-6 object-contain" />
                </div>
              )}
            </button>
          </div>

          {/* Footer */}
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-md mt-auto w-full ${
              open ? "justify-start" : "justify-center"
            }`}
            style={{ minHeight: 64 }}
          >
            <img
              src="/profile.svg"
              alt="Foto Profil"
              className="h-6 w-6 rounded-full object-cover"
            />
            {open && (
              <div className="flex flex-col">
                <span className="text-sm text-neutral-500">Selamat Datang</span>
                <span className="font-semibold text-neutral-800">{userName}</span>
              </div>
            )}
          </div>
        </motion.div>
      </Sidebar>
    </div>
  );
}