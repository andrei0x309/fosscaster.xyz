import React from "react";
import { Button } from "~/components/ui/button"
import { PenSquare, ArrowLeft } from 'lucide-react'
import { useMainStore } from "~/store/main"


export function OptionalEndContent({ children } : { children: React.ReactNode }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}

export const CastHeader = ({
  title = 'Explore',
  hasBackButton = false,
  hasComposeButton = true,
  hasOptionalEndContent = false,
  children = undefined,
  className = '',
  headerClassName = '',
  channelKey = '',
}: {
  title?: string
  hasBackButton?: boolean,
  hasComposeButton?: boolean,
  hasOptionalEndContent?: boolean,
  children?: React.ReactNode | undefined
  className?: string,
  headerClassName?: string,
  channelKey?: string
}) => {
  const { isUserLoggedIn, setConnectModalOpen, navigate, setComposeModalOpen, setComposeModalData, isMiniApp, setIsMiniApp } = useMainStore()
  const optionalEndContentChildren = [] as React.ReactNode[]


  if (hasOptionalEndContent && children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === OptionalEndContent) {
        optionalEndContentChildren.push(child)
      }
    })
  }

  const handleClickCast = () => {
    if (!isUserLoggedIn) {
      setConnectModalOpen(true)
      return
    }
    if (channelKey) {
      setComposeModalData({
        channelKey,
      })
    }
    setComposeModalOpen(true)
  }

 

  return (
    <div className={`sticky flex-col dark:bg-neutral-950 bg-white top-0 z-10 flex w-full border-b-[1px] bg-app border-default ${isMiniApp ? 'h-18': 'h-16'} p-2 ${className}`}>

{isMiniApp &&
        // add red banner with a button to open the app fully
        <div className="-mt-2 mb-1 w-full h-min dark:bg-neutral-700/40 bg-neutral-300/60 dark:text-white flex items-center justify-center text-[0.8rem] border-[1px] rounded-xl border-neutral-700/40">
          <div className="flex items-center">
            <div className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              </div>
              <div className="text-[0.85rem]">
                <p>Running in Mini-app</p>
                </div>
            </div>
        <button className="ml-2 dark:bg-neutral-900 bg-neutral-200 border-[1px] border-neutral-700/40 dark:text-red-500 text-green-700 px-2 rounded-sm my-1 dark:hover:bg-neutral-800 hover:bg-neutral-300" onClick={() => {
          window.open('https://fosscaster.xyz', '_blank');
        }}>
          Open Web Client
          </button>
          <button className="ml-2 bg-neutral-900 text-white  rounded-md hover:bg-neutral-800 absolute right-4" onClick={() => {
           setIsMiniApp(false)
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
    </div>
    }

      <div className="flex items-center justify-between p-4 w-full -my-2">
        <h1 className={`sm:ml-6 text-lg font-bold -mt-2 ml-2 md:-ml-2 ${headerClassName}`}>
          {hasBackButton ? <Button variant="ghost" size="icon" className='top-[0.35rem] relative mr-2' >
            <ArrowLeft className="h-6 w-6" onClick={() => navigate(-1)} />
          </Button> : null}
          {title}
        </h1>
        {hasComposeButton ? <div className="flex items-center space-x-2">
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleClickCast}>
            <PenSquare className="h-4 w-4 mr-2" />
            Cast
          </Button>
        </div> : null}
        {hasOptionalEndContent ? optionalEndContentChildren : null}
      </div>
    </div>
  )
}