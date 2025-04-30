export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const timeAgo = (date: string | number, shortFormat = false) => {
    
    const dateInMs = new Date(date).getTime()
    const seconds = Math.floor((Date.now() - dateInMs) / 1000);
    let interval = seconds / 31536000;
    let intervalType: string;

    if (interval >= 1) {
        intervalType = 'yr';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'mo';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'd';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hr";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "min";
                    } else {
                        interval = seconds;
                        intervalType = "s";
                    }
                }
            }
        }
    }

    if (shortFormat) {
       if (intervalType.startsWith('second') || intervalType.startsWith('minute')  || intervalType.startsWith('hour') ) {
           return interval.toFixed(0) + ' ' + intervalType;
        }
       const year = new Date().getFullYear()
       const day = new Date(dateInMs).getDate() + 1
       const month = new Date(dateInMs).getMonth() + 1
       return `${day}/${month}/${year.toString().slice(2)}`
    }
    return interval.toFixed(0) + ' ' + intervalType + ' ago';
}

export const formatNumber = (num: number, digits = 0) => {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: digits
    }).format(num)
}


export function addNotificationBadge() {
    const link = document.querySelector('link[rel="shortcut icon"]');
    if (link) {
      link.remove();
    }
    const newLink = document.createElement('link') as HTMLLinkElement;
    newLink.rel = 'shortcut icon';
    newLink.href = '/favicon-notif.png';
    document.head.appendChild(newLink);
  }
  
  export function removeNotificationBadge() {
    const link = document.querySelector('link[rel="shortcut icon"]');
    if (link) {
      link.remove();
    }
    const newLink = document.createElement('link') as HTMLLinkElement;
    newLink.rel = 'shortcut icon';
    newLink.href = '/favicon.png';
    document.head.appendChild(newLink);
  }

  export function getStringByteLength(str: string): number {
    const encoder = new TextEncoder();
    const encodedBytes: Uint8Array = encoder.encode(str);
    return encodedBytes.byteLength;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  export function debounce<T extends Function>(func: T, delay: number): (...args: any[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(this: any, ...args: any[]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }

  export const gcd = (a: number, b: number): number => {
    return b
      ? gcd(b, a % b)
      : a;
  };
  
  export const aspectRatio = (width: number, height: number)  => {
    const divisor = gcd(width, height);
  
    return `${width / divisor}:${height / divisor}`;
  };
  