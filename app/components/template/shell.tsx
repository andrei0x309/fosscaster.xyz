
import React, { useEffect, useRef, useCallback } from 'react'
import { useMainStore, setInitialState } from "~/store/main"
import { ModalManager } from  "~/components/functional/mini-app-manager"

import { SignInOrSignUpModal } from "~/components/functional/modals/sign-or-register-modal"

import { LightBoxModal } from '~/components/functional/modals/light-box'
import { useNavigate } from "react-router";

export const Shell = React.memo(function Shell ({ children = false}:
   { children: React.ReactNode}) {

    const { isDarkMode, setIsTablet, setIsMobile, setNavigate } = useMainStore()
    const navigate = useRef(useNavigate())

    const memoizedNavigate = useCallback((path: string) => {
      navigate.current(path)
    }, [navigate]);
    
    useEffect(() => {
      setNavigate(navigate.current as any)
    }, [memoizedNavigate, setNavigate])

    useEffect(() => {
      setInitialState()
    }, [])


    useEffect(() => {
      const checkSize = () => {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches)
        setIsTablet(window.matchMedia('(max-width: 1024px)').matches)
      }
      window.addEventListener('resize', checkSize)
      return () => window.removeEventListener('resize', checkSize)
    }, [setIsMobile, setIsTablet])
  
  
    useEffect(() => {
      document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])
    
    useEffect(() => {
        const checkSize = () => {
          setIsMobile(window.matchMedia('(max-width: 768px)').matches)
          setIsTablet(window.matchMedia('(max-width: 1024px)').matches)
        }
        window.addEventListener('resize', checkSize)
        return () => window.removeEventListener('resize', checkSize)
      }, [setIsMobile, setIsTablet])
    
 
 
    return (
        <div className="mx-auto min-h-full block lg:flex md:px-3 justify-center">
        <div className={` bg-white dark:bg-neutral-950 min-h-screen block lg:flex`}>
          {children}
        </div>
        <SignInOrSignUpModal />
        <LightBoxModal />
        <ModalManager />

        </div>
    )
})

// export const Shell = function ({ children, noLeftSidebar = false, noRightSidebar = false }:
//    { children: React.ReactNode, noLeftSidebar?: boolean, noRightSidebar?: boolean }) {
//   return useMemo(() => ShellBase({ children, noLeftSidebar, noRightSidebar }), [children, noLeftSidebar, noRightSidebar]);
// }