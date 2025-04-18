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
}: {
  title?: string
  hasBackButton?: boolean,
  hasComposeButton?: boolean,
  hasOptionalEndContent?: boolean,
  children?: React.ReactNode | undefined
  className?: string,
  headerClassName?: string,
}) => {
  const { isUserLoggedIn, setConnectModalOpen, navigate, setComposeModalOpen } = useMainStore()
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
    setComposeModalOpen(true)
  }

  return (
    <div className={`sticky dark:bg-neutral-950 bg-white top-0 z-10 flex w-full border-b-[1px] bg-app border-default h-14 p-2 ${className}`}>

      <div className="flex items-center justify-between p-4 w-full">
        <h1 className={`text-lg font-bold -mt-2 ml-2 md:-ml-2 ${headerClassName}`}>
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