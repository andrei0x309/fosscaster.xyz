import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"

export const PopOverMenuItem = DropdownMenuItem

export const PopOverMenu = ({ trigger, content }: { trigger: React.ReactNode, content: React.ReactNode }) => {
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56  dark:bg-neutral-950 dark:text-white border-neutral-500 text-neutral-900 bg-neutral-50">
        {content}
      </DropdownMenuContent>
      </DropdownMenu>
    )
}

