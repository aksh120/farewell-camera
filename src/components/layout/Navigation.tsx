"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Images } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const links = [
    { href: "/", icon: Camera, label: "Camera" },
    { href: "/gallery", icon: Images, label: "Gallery" },
  ];

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-40 flex justify-center safe-area-inset-bottom">
      <div
        className="
                flex items-center gap-1
                bg-vintage-black/80 backdrop-blur-xl 
                border border-white/10 rounded-full 
                shadow-2xl shadow-black/40
                p-1
            "
      >
        {links.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                                relative flex items-center justify-center
                                w-12 h-12 rounded-full
                                transition-all duration-300
                                ${
                                  isActive
                                    ? "text-vintage-black bg-vintage-cream shadow-md"
                                    : "text-vintage-beige/60 hover:text-vintage-cream hover:bg-white/5"
                                }
                            `}
              aria-label={href === "/" ? "Camera" : "Gallery"}
            >
              <Icon
                strokeWidth={isActive ? 2.5 : 2}
                className={`
                                    w-5 h-5 transition-transform duration-300
                                    ${isActive ? "scale-110" : "scale-100"}
                                `}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
