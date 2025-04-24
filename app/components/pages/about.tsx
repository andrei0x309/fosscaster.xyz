import { Button } from '~/components/ui/button'
import { GhButton } from '~/components/atomic/gh-button'
import { ArrowRightIcon } from 'lucide-react'
import { useMainStore } from '~/store/main'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = ({ matches }) => {
    const parentMeta = matches.flatMap(
      (match) => match.meta ?? []
    );
    return [...parentMeta, { title: "Fosscaster.xyz - About" }];
};

export default function AboutPage({className}: {className?: string}) {

  const { navigate } = useMainStore()
  
  return (
    <div className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] flex flex-col items-center ${className}`}>
    <div className="p-8" >
    
    <h1 className="text-4xl font-bold mb-4">FC App</h1>
      { /* SubTitle */}
    { /* Shor desc */}
    <p className="text-left" style={{ display: 'ruby'}}>This is an  open-source ( <GhButton onClick={
            () => window.open('https://https://github.com/andrei0x309/fosscaster.xyz')
 }/> ) UI implementation of Warpcast, that uses Warpcast API to operate.</p>
    { /* Subtitle for FAQ */}
    <h2 className="text-2xl font-bold mt-8">FAQ</h2>
    { /* FAQ */}
    <div className="flex flex-col space-y-4">
        <p className="text-lg font-semibold mt-4">Why to use this UI instead of Warpcast UI?</p>
        <ul className="list-disc list-inside">
            <li>It gives full control over the sign-in flow, and you can use any wallet</li>
            <li>Disables features that conflict with Web3 ethos, like view events, analytics,
                limiting people to sign-in with mobile, limiting only people that made account 
                with warpcast, no need for email or phone, no warps, no off-chain payments etc.</li>
            <li>It&apos;s open-source, and you can use the UI as you wish</li>
            <li>I May add some small UI features that are not present in Warpcast</li>
            <li>Is mostly as POC, but you can use it as you wish</li>
        </ul>

        <p className="text-lg font-semibold">Does Warpcast nerfs/boosts affect this UI?</p>
        <ul className="list-disc list-inside">
            <li>Yes, it does. The nerfs are applied at API level, so this UI will be affected as well.</li>
            <li>All manual and AI actions that derank, boost, shadowban, or exclude content will be applied to this UI as well.</li>
        </ul>
        { /* Subtitle for More Details */}
        <h2 className="text-2xl font-bold">More Details</h2>
        { /* More Details */}
        <p>I&apos;ve been on farcaster since its beginning (
          <span className="text-red-500 font-bold cursor-pointer hover:text-red-700" onClick={() => navigate('/andrei0x309')} role='button' aria-label='Go to Andrei0x309 profile' onKeyDown={() => {}} tabIndex={0}>
          FID: 1791
          </span>
          ), if you want to read about my experience after two plus years and you&apos;re ready for a long read I invite you to check this article:</p>
        <Button className='w-full mx-auto max-w-[26rem] bg-red-600 hover:bg-red-700 text-white text-[0.77rem] flex' onClick={ () => window.open('https://blog.flashsoft.eu/farcaster-good-bad-ugly-three-years')}>
            <ArrowRightIcon className="h-4 w-4 mr-2" />
            <span>Farcaster & Warpcast The Good The Bad The Ugly after ~3 years</span>
        </Button>
    </div>
    </div>
  </div>
  )
}