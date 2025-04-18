'use client'

import { DialogTitle } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogDescription} from "~/components/ui/dialog"

export function Modal({ 
  isOpen,
  setIsOpen,
  children,
  dialogTitleText = '',
  preventClose = false,
  doPreventCloseAnimation = true,
  className = '',
  onTryToClose = () => {} 
} : 
{ isOpen: boolean,
  setIsOpen: (value: boolean) => void,
  children: React.ReactNode,
  dialogTitleText?: string,
  preventClose?: boolean,
  doPreventCloseAnimation?: boolean,
  className?: string,
  onTryToClose?: () => void 
}) {
  
  const preventCloseFn = () => {
    if (!doPreventCloseAnimation) {
      return
    }
    const el = document.querySelector('.modal-dialog')

    el?.animate([
       { transform: 'translateY(-50%) translateX(-50%)'},
       { transform: 'translateY(-50%) translateX(-51%)'},
       { transform: 'translateY(-50%) translateX(-50%)'},
       { transform: 'translateY(-50%) translateX(-51%)'},
       { transform: 'translateY(-50%) translateX(-50%)'},
       { transform: 'translateY(-50%) translateX(-51%)'},
       { transform: 'translateY(-50%) translateX(-50%)'},
       { transform: 'translateY(-50%) translateX(-51%)'},
    ], {
      duration: 500,
      iterations: 1
    })
  }

  const onOpenChange = (state: boolean) => {
    if(!state){
      onTryToClose()
    }
    return preventClose ? preventCloseFn() : setIsOpen(state)
  }
  


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} aria-describedby="modal-description" aria-labelledby="modal-title">
      <DialogContent
      aria-describedby="modal"
      
      onInteractOutside={(e) => {
        if(preventClose) {
          e.preventDefault()
        }
      }}
      className={`sm:max-w-[600px] dark:bg-[#111] dark:text-teal-50 modal-dialog ${className}`} aria-labelledby="modal-title">
      <DialogTitle className="text-lg font-bold">{dialogTitleText}</DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>

        {children}
      </DialogContent>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      )}
    </Dialog>
  )
}