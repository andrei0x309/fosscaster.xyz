import { useEffect, useRef } from 'react';


function useSaveRestoreScroll(isActive: boolean) {
  const scrollableElementRef = useRef(null ) as React.RefObject<HTMLElement>

  const savedScrollPosition = useRef(0);

  useEffect(() => {
    const currentScrollableElement = scrollableElementRef.current;

    if (isActive) {
      if (currentScrollableElement) {
        requestAnimationFrame(() => {
          currentScrollableElement.scrollTop = savedScrollPosition.current;
        });
      }
    } else {
      if (currentScrollableElement) {
        savedScrollPosition.current = currentScrollableElement.scrollTop;
      }
    }

  }, [isActive]);

  return scrollableElementRef;
}

export default useSaveRestoreScroll;