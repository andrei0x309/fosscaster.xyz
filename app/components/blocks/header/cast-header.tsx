import { useState,  } from 'react'
import { Button } from "~/components/ui/button"
import { PenSquare, ArrowLeft } from 'lucide-react'
import { useMainStore } from "~/store/main"
import { ComposeModal } from "~/components/functional/modals/compose-cast"


export const CastHeader = ({
    title = 'Explore',
    hasBackButton = false
}: {
    title?: string
    hasBackButton?: boolean
}) => {
    //   {currentFeed === 'home' ? 'Home' : currentFeed === 'trending' ? 'Trending' : currentFeed === 'trending-frames' ? 'Frames' : 'All Channels'}


    const { isUserLoggedIn, setConnectModalOpen, navigate } = useMainStore()
    const [isComposeModalOpen, setComposeModalOpen] = useState(false)


    const handleClickCast = () => {
        if(!isUserLoggedIn) {
          setConnectModalOpen(true)
          return
        }
        setComposeModalOpen(true)
      }

    return (
        <div className="flex items-center justify-between p-4 w-full">
        <h1 className="text-lg font-bold -mt-2 -ml-2">
           { hasBackButton ? <Button variant="ghost" size="icon" className='top-[0.35rem] relative mr-2' >
                      <ArrowLeft className="h-6 w-6" onClick={() => navigate(-1)} />
            </Button> : null }
            {title}
        </h1>
        <div className="flex items-center space-x-2">
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleClickCast}>
            <PenSquare className="h-4 w-4 mr-2" />
            Cast
          </Button>
          <ComposeModal isOpen={isComposeModalOpen} setOpen={setComposeModalOpen} />
        </div>
      </div>
)
    }