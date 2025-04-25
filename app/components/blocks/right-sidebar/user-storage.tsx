import { styled , createGlobalStyle } from "styled-components";
import { useMainStore } from "~/store/main";
import { useState, useEffect } from "react";
import { getStorageUtilization } from "~/lib/api";


export const StorageCard = () => {

    const { isUserLoggedIn, mainUserData } = useMainStore()
    const [castLevel, setCastLevel] = useState(11)
    const [reactionLevel, setReactionLevel] = useState(54)
    const [followLevel, setFollowLevel] = useState(33)

    useEffect(() => {
        if (isUserLoggedIn) {
            getStorageUtilization().then((res) => {
                const { casts, reactions, links } = res.result.storageUtilization
 
                setCastLevel(Math.trunc((casts.used / casts.rented) * 100))
                setReactionLevel(Math.trunc((reactions.used / reactions.rented) * 100))
                setFollowLevel(Math.trunc((links.used / links.rented) * 100))
            })
        }
    }, [isUserLoggedIn, mainUserData?.fid]) 

  return (
    <>
    <StyledWrapper>
      <div className="container-storage bg-neutral-100 dark:dark:bg-zinc-900 rounded-lg p-4 mb-4">
      <h2 className="font-semibold mb-2">Storage {!isUserLoggedIn ? <span className="text-[.7rem] font-normal">(login to see your storage)</span> : null}</h2>
        <div className={`storage-box ${!isUserLoggedIn ? 'opacity-40' : ''}`}>
          <div className={`storage-bar`} >
            <span className={`storage-per st-casts`} style={{ width: `${castLevel}%` }} >
              <span className="tooltip">{castLevel}%</span>
            </span>
          </div>
          <span className="title mt-1">Casts</span>
        </div>

        <div className={`storage-box ${!isUserLoggedIn ? 'opacity-40' : ''}`}>
          <div className="storage-bar">
            <span className={`storage-per st-reactions`} style={{ width: `${reactionLevel}%` }} >
              <span className="tooltip">{reactionLevel}%</span>
            </span>
          </div>
          <span className="title mt-1">Reactions</span>
        </div>

        <div className={`storage-box ${!isUserLoggedIn ? 'opacity-40' : ''}`}>
          <div className="storage-bar">
            <span className={`storage-per st-follows`} style={{ width: `${followLevel}%` }} >
              <span className="tooltip">{followLevel}%</span>
            </span>
          </div>
          <span className="title mt-1">Follows</span>
        </div>
      </div>
    </StyledWrapper>
    <GlobalStyle />
    </>
  );
};

const GlobalStyle = createGlobalStyle`

  .dark .storage-box .storage-bar {
    background: rgba(236, 236, 236, 0.1)!important;
  }

  .dark .storage-bar .storage-per {
    background: rgba(244, 244, 244, 0.2)!important;
  }


  .storage-box .storage-bar {  
    background: rgba(20, 20, 20, 0.4);
  }

  .storage-bar .storage-per {
    background: rgba(25, 25, 25, 0.55);
  }


`;

const StyledWrapper = styled.div`
  .container-storage {
  position: relative;
  width: 100%;
  border-radius: 7px;
}

.container-storage .storage-box {
  width: 100%;
  margin-top: 2.2rem;
}

.storage-box .title {
  display: block;
  font-size: 14px;
  font-weight: 600;
}

.storage-box .storage-bar {
  height: 8px;
  width: 100%;
  border-radius: 6px;
  margin-top: 6px;
}


.storage-bar .storage-per {
  position: relative;
  display: block;
  height: 100%;
  border-radius: 6px;
  animation: progress 0.4s ease-in-out forwards;
  opacity: 0;
}

.storage-per.st-casts {
  animation-delay: 0.1s;
}

.storage-per.st-reactions {
  animation-delay: 0.1s;
}

.storage-per.st-follows {
  animation-delay: 0.2s;
}

@keyframes progress {
  0% {
    width: 0;
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.storage-per .tooltip {
  position: absolute;
  right: -14px;
  top: -28px;
  font-size: 9px;
  font-weight: 500;
  color: rgb(0, 0, 0);
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgb(226, 226, 226);
  z-index: 1;
}

.tooltip::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -2px;
  height: 10px;
  width: 10px;
  z-index: -1;
  background-color: rgb(226, 226, 226);
  transform: translateX(-50%) rotate(45deg);
}

`;

