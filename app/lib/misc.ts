export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const timeAgo = (date: string) => {

    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    let intervalType: string;

    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
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