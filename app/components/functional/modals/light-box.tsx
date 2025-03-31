'use client'
import { Img as Image } from 'react-image'
import { Modal } from "~/components/functional/modals/modal"
import { useMainStore } from '~/store/main'

export function LightBoxModal() {

  const { setLightBoxOpen, lightBoxOpen, lightBoxSrc } = useMainStore()
 
  return (
       <Modal isOpen={lightBoxOpen} setIsOpen={setLightBoxOpen} dialogTitleText={''} preventClose={false} className="h-[98vh]" >
            <div className="flex flex-col items-center">
            <Image src={[lightBoxSrc, '/placeholder.svg']} alt="Lightbox" className="w-full h-full object-cover border-2 border-[#1c1c24]" />
            <a href={lightBoxSrc} download className="text-red-600 mt-2">Source</a>
            </div>
      </Modal>
  )
}