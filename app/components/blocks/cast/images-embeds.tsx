import type { Image } from "~/types/wc-feed-items"
import { useMainStore } from "~/store/main"


export const ImageEmbeds = ({ images = [] as Image[]}: { images: Image[]}) => {

  const {setLightBoxOpen, setLightBoxSrc } = useMainStore()

  const onImageClick = (src: string) => {
    setLightBoxSrc(src)
    setLightBoxOpen(true)
  }

    return (
        (images?.length > 0) ? (<div className="flex flex-wrap relative min-w-0 max-w-full border-default w-full justify-between rounded-lg mt-1">
        { images?.map((img, i: number) =>
          <img key={`${i}${img.url.slice(-1. -10)}`} 
          src={img.url as string} 
          style={{ flex: '0 0 auto', [images?.length > 1 ? 'width' : '']: `${images?.length > 1 ? (100 /  (images?.length ?? 1) - 1)+'%': ''}` }} 
          alt={img.alt as string} className={`relative cursor-pointer object-scale-down object-left-top bg-overlay-faint max-h-[30rem] p-[2px] border`} 
          onClick={() => onImageClick(img.url as string)} aria-hidden="true"
          />
        )}
      </div>)
      : null
    )
}