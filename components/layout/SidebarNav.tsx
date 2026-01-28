/**
 * Sidebar navigation with white theme matching the FOBOH design.
 * Features: logo, nav items with icons, green active indicator, "NEW" badge with background
 */
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: "grid", path: "/dashboard" },
  { name: "Orders", icon: "shopping-bag", path: "/orders" },
  { name: "Customers", icon: "users", path: "/customers" },
  { name: "Products", icon: "package", path: "/products" },
  { name: "Pricing", icon: "tag", path: "/pricing" },
  { name: "Freight", icon: "truck", path: "/freight", badge: "NEW" },
  { name: "Integrations", icon: "puzzle", path: "/integrations" },
  { name: "Settings", icon: "settings", path: "/settings" },
];

// Simple SVG icons
function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      </svg>
    ),
    "shopping-bag": (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    users: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    package: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    tag: (
      <svg className="h-5 w-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    truck: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    puzzle: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    settings: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 flex-col bg-white border-r border-slate-100 md:flex sticky top-0 h-screen">
      {/* Logo - FOBOH text */}
      <div className="px-6 py-5">
        <span className="text-2xl tracking-wide text-slate-900 font-extrabold">FOBOH</span>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 px-3">
        {navItems.map((item) => {
          // Check if current path matches or starts with the nav item path
          // This handles /pricing/setup and /pricing/profiles/* routes
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          
          return (
            <a
              key={item.name}
              href={item.path}
              className={`relative mb-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-[#147D64]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {/* Green active indicator - vertical bar on right */}
              {isActive && (
                <div className="absolute right-0 top-1/2 h-full w-[3px] -translate-y-1/2 bg-[#51b39c]" />
              )}
              <NavIcon name={item.icon} />
              <span className={`flex-1 ${isActive ? "text-black font-bold" : "text-slate-600"}`}>{item.name}</span>
              {item.badge && (
                <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-red-500">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
