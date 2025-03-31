export function HydrateFallback() {
    return  (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ width: 45, height: 40, background: 'linear-gradient(#0000 calc(1*100%/6),#fff 0 calc(3*100%/6),#0000 0),linear-gradient(#0000 calc(2*100%/6),#fff 0 calc(4*100%/6),#0000 0),linear-gradient(#0000 calc(3*100%/6),#fff 0 calc(5*100%/6),#0000 0)', backgroundSize: '10px 400%', backgroundRepeat: 'no-repeat', animation: 'matrix 1s infinite linear', marginLeft: 'auto', marginRight: 'auto', marginTop: '-10vh'}}>
    </div>
    </div>
    )
  }