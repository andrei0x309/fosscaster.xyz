import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

 
export const YoutubeEmbed = ({ url } : { url: string }) => {
 
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [videoId, setVideoId] = useState('')

    useEffect(() => {
     if (!url) {
        setLoading(false)
        return
     }
 
     if (url.includes('youtu.be')) {
        setVideoId(url.split('youtu.be/')[1].split('?')[0].trim())
        setLoaded(true)
        setLoading(false)
        return
     } else if (url.includes('shorts/')){
        setVideoId(url.split('shorts/')[1].split('?')[0].trim())
        setLoaded(true)
        setLoading(false)
        return
     }
     const ilegalChars = ['&', '?', 'v=', '"', "'", ' ']

     const match = /v=(.*?)$/.exec(url.split('&')[0])
     
     let videoId = ''

     if (match) {
       videoId = match[1]
     }
     ilegalChars.forEach(char => {
       videoId = videoId.replace(char, '')
     })
     setVideoId(videoId)
     setLoaded(true)
     setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
<div className="mt-2">
   { loading && <Loader2 className="animate-spin w-4 h-4" />}
  { loaded && <iframe
    loading="lazy"
    className="w-full min-h-60"
    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    onLoad={() => setLoading(false)}
  ></iframe>}
</div>
  );
};
