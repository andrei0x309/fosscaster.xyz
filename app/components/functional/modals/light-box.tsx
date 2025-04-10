'use client'
import { Img as Image } from 'react-image'
import { Modal } from "~/components/functional/modals/modal"
import { useMainStore } from '~/store/main'
import { ExternalLink } from 'lucide-react'

export function LightBoxModal() {

  const { setLightBoxOpen, lightBoxOpen, lightBoxSrc } = useMainStore()
 
  return (
       <Modal isOpen={lightBoxOpen} setIsOpen={setLightBoxOpen} dialogTitleText={''} preventClose={false} className="bg-neutral-600/20 border-0 max-h-[98%]" >
            <div className="flex flex-col items-center blur-0 m-auto">
            <Image src={[lightBoxSrc, '/placeholder.svg']} alt="Lightbox" className="w-full h-full object-cover border-2 border-[#1c1c24] max-h-[85%]" />
            <a href={lightBoxSrc} download className="text-red-600 mt-2">Source <ExternalLink className="w-6 inline" /> </a>
            </div>
      </Modal>
  )
}