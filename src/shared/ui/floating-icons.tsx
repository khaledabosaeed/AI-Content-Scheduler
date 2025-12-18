"use client"

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  MessageSquare,
  Globe,
} from "lucide-react"

export function FloatingIcons() {
  return (
    <div
      className="
        absolute inset-0 overflow-hidden
        bg-gradient-to-br
        from-primary/5 to-secondary/5
       
        
        pointer-events-none
      "
    >
      {/* Animations */}
      <style>{`
        @keyframes float-slow {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-medium {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
        @keyframes float-fast {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float-slow { animation: float-slow 8s ease-in-out infinite; }
        .float-medium { animation: float-medium 6s ease-in-out infinite; }
        .float-fast { animation: float-fast 5s ease-in-out infinite; }
      `}</style>

      {/* Facebook */}
      <Icon
        className="top-[15%] left-[10%] float-slow"
        icon={<Facebook />}
        color="text-blue-500/50 dark:text-blue-400/60 hover:text-blue-600 dark:hover:text-blue-300"
      />

      {/* Twitter */}
      <Icon
        className="top-[20%] right-[12%] float-medium"
        icon={<Twitter />}
        color="text-gray-500/50 dark:text-gray-400/60 hover:text-foreground"
      />

      {/* Instagram */}
      <Icon
        className="top-[45%] left-[8%] float-fast"
        icon={<Instagram />}
        color="text-pink-400/50 dark:text-pink-400/60 hover:text-pink-500"
        size="w-12 h-12"
      />

      {/* LinkedIn */}
      <Icon
        className="top-[50%] right-[10%] float-slow"
        icon={<Linkedin />}
        color="text-blue-600/50 dark:text-blue-400/60 hover:text-blue-700"
      />

      {/* GitHub */}
      <Icon
        className="bottom-[25%] left-[15%] float-medium"
        icon={<Github />}
        color="text-muted-foreground hover:text-foreground"
        size="w-7 h-7"
      />

      {/* Message */}
      <Icon
        className="bottom-[20%] right-[15%] float-fast"
        icon={<MessageSquare />}
        color="text-green-400/50 dark:text-green-400/60 hover:text-green-500"
      />

      {/* Globe */}
      <Icon
        className="top-[35%] left-[20%] float-slow"
        icon={<Globe />}
        color="text-yellow-400/50 dark:text-yellow-300/60 hover:text-yellow-500"
        size="w-6 h-6"
      />
    </div>
  )
}

/* -------------------------------- */

function Icon({
  className,
  icon,
  color,
  size = "w-8 h-8",
}: {
  className: string
  icon: React.ReactNode
  color: string
  size?: string
}) {
  return (
    <div className={`absolute ${className} pointer-events-auto z-50`}>
      <div className="relative w-full h-full">
        <div
          className={`
            ${size} ${color}
            opacity-70 hover:opacity-100
            transition-all duration-300
            transform-gpu hover:scale-125
            origin-center
            z-50
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

