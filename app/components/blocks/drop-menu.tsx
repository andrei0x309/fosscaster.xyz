import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "~/components/ui/dropdown-menu"

import { useRef, useEffect } from 'react'

export const PopOverMenuItem = DropdownMenuItem

export const PopOverMenu = ({ trigger, content, controlled = false, isOpen = false, clickOutsideToClose = false, onClickOutside = () => {}}: { trigger: React.ReactNode, content: React.ReactNode, isOpen?: boolean, controlled?: boolean, clickOutsideToClose?: boolean , onClickOutside?: () => void }) => {
  
  const popoverRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
       if (clickOutsideToClose) {
          onClickOutside();
        }
      }
    };

    if (isOpen && controlled && clickOutsideToClose) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickOutsideToClose, controlled, isOpen]);
  
  return (
        <DropdownMenu open={controlled ? isOpen : undefined} modal={false}>
        <DropdownMenuTrigger asChild>
            {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent ref={popoverRef} className="w-56 dark:bg-neutral-950 dark:text-white border-neutral-500 text-neutral-900 bg-neutral-50">
        {content}
      </DropdownMenuContent>
      </DropdownMenu>
    )
}

