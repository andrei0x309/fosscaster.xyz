
import { Menu } from "lucide-react"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { useMainStore } from "~/store/main"
import { LeftSidebarContent } from "~/components/template/inner/left-sidebar-content"
import { persistDarkMode } from "~/lib/localstorage"
import { AddAccountModal } from "~/components/functional/modals/add-account"
import { useState, memo } from "react"

export const LeftSidebar = memo(function LeftSidebar (
  { className = '' }: { className?: string }
) {
  const { isDarkMode, toggleDarkMode, isMiniApp } = useMainStore()
  const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false)
 
  const toggleTheme = () => {
    toggleDarkMode()
    persistDarkMode(!isDarkMode)
  }

  return (
     <aside>
      {/* Add Account Modal */}
      <AddAccountModal isModalOpen={isAddAccountModalOpen} setModalOpen={setAddAccountModalOpen} />

      {/* Left Sidebar */}
      <nav className={`border-r border-neutral-400/50 flex-col p-4 sticky top-0 h-screen shrink-0 hidden max-w-[17rem] lg:flex ${className}`}>
        <ScrollArea className="flex-1">
          <LeftSidebarContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} setAddAccountModalOpen={setAddAccountModalOpen} />
        </ScrollArea>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button className={`mt-6 fixed ${isMiniApp ? 'top-5' :'-top-3'} left-3 z-[11] lg:hidden`} variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <ScrollArea className="h-full">
            <LeftSidebarContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} setAddAccountModalOpen={setAddAccountModalOpen} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </aside>
    )
})


