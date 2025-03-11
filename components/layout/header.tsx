"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [imageError, setImageError] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Rail Madad AI
            </span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-blue-600 ${
              isActive("/") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/submit"
            className={`transition-colors hover:text-blue-600 ${
              isActive("/submit") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Submit Complaint
          </Link>
          <Link
            href="/track"
            className={`transition-colors hover:text-blue-600 ${
              isActive("/track") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Track Complaint
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`transition-colors hover:text-blue-600 ${
                isActive("/admin") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Admin
            </Link>
          )}
          {user?.role === "worker" && (
            <Link
              href="/worker"
              className={`transition-colors hover:text-blue-600 ${
                isActive("/worker") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Worker Dashboard
            </Link>
          )}
          {user && (
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-blue-600 ${
                isActive("/dashboard") ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden">
                  {user.image && !imageError ? (
                    <Image
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">Role: {user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="w-full cursor-pointer">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === "worker" && (
                  <DropdownMenuItem asChild>
                    <Link href="/worker" className="w-full cursor-pointer">
                      Worker Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onSelect={(event) => {
                    event.preventDefault()
                    logout()
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

