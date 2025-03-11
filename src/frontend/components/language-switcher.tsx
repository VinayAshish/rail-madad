"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/frontend/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "kn", name: "ಕನ್ನಡ" },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (locale: string) => {
    // Extract the current locale from the pathname
    const segments = pathname.split("/")
    const currentLocale = segments.length > 1 && languages.some((lang) => lang.code === segments[1]) ? segments[1] : ""

    // Create the new path with the selected locale
    let newPath
    if (currentLocale) {
      // Replace the current locale with the new one
      newPath = pathname.replace(`/${currentLocale}`, `/${locale}`)
    } else {
      // Add the locale to the beginning of the path
      newPath = `/${locale}${pathname}`
    }

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

