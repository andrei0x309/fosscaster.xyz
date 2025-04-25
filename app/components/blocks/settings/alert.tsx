import { Button } from "~/components/ui/button"


export function SettingsAlert({
    error,
    success,
    setSuccess,
    setError,
} : {
    error: string,
    success: string,
    setError: (error: string) => void,
    setSuccess: (success: string) => void
}) {


return (<>
{error || success ? <div className="my-3">
    
    {/* ALert Error */}
{error && 
<div className="bg-red-700 text-white p-2 rounded flex justify-between">
<span className='mt-2 flex flex-col' >
<span className='w-full'>{error}</span>
</span>
<Button onClick={() => setError('')} className="ml-2 lr-auto" variant={'outline'}>x</Button>
</div>}
{/* ALert Success */}
{success &&
<div className="bg-green-700 text-white p-2 rounded flex justify-between">
<span className='mt-2 flex flex-col' >
<span className='w-full'>{success}</span>
</span>
<Button onClick={() => setSuccess('')} className="ml-2 lr-auto" variant={'outline'}>x</Button>
</div>} 
</div> : null}
</>)

}