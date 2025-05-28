import type { FrameEmbedNext } from "~/types/cast/wc-mini-app"
import { useMainStore } from "~/store/main"

export const MiniAppInCast = ({app} : { app: FrameEmbedNext}) => {

  const { openMiniApp } = useMainStore()

  const doOpenMiniApp = () => {
    
    
    if (!app?.frameEmbed?.button?.action?.url && !app?.frameUrl) return

    openMiniApp({
      homeUrl: app?.frameEmbed?.button?.action?.url || app?.frameUrl,
      fetchFrameData: true
    })
  }

  return (
    <div className="mt-4 rounded-md overflow-hidden border-neutral-500 border-[1px] cursor-pointer action" style={{ maxWidth: '100%' }} onClick={() => doOpenMiniApp()} aria-hidden>
      <div className="bg-neutral-700/20 p-2 flex items-center justify-center">
      <img loading="lazy" src={app?.frameEmbed?.imageUrl} 
      alt="mini app" className="w-full opacity-100" 
      style={{
        aspectRatio: "1.5 / 1",
        objectFit: "cover",
        objectPosition: "center center",
      }}
       />
       </div>
      <button className="dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-200 hover:bg-neutral-300 border-neutral-500 h-12 border-t-[1px] py-2 px-4 text-center text-sm font-mono w-full ">{app?.frameEmbed?.button?.title}</button>
    </div>
  );
};