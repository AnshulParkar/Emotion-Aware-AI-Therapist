"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Menu, X, User, Play, Calendar, LogOut } from "lucide-react"

interface MobileNavigationProps {
  className?: string
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const closeSheet = () => setIsOpen(false)

  if (!session) {
    return (
      <div className={`md:hidden ${className || ""}`}>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={closeSheet} className="p-1">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Button variant="ghost" asChild className="justify-start" onClick={closeSheet}>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="justify-start" onClick={closeSheet}>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className={`md:hidden ${className || ""}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={closeSheet} className="p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-4">
            {(session.user as any)?.role === "patient" && (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={closeSheet}>
                  <Link href="/patient/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild className="justify-start" onClick={closeSheet}>
                  <Link href="/patient/session">
                    <Play className="mr-2 h-4 w-4" />
                    Start Session
                  </Link>
                </Button>
              </>
            )}
            {(session.user as any)?.role === "therapist" && (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={closeSheet}>
                  <Link href="/therapist/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild className="justify-start" onClick={closeSheet}>
                  <Link href="/therapist/schedule">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Link>
                </Button>
              </>
            )}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  closeSheet()
                  signOut({ callbackUrl: "/" })
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNavigation