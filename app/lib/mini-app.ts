const FrameConfig = {
    imageUrl: 'https://fosscaster.xyz/hotlink-ok/og/default.webp',
    splashImageUrl: 'https://fosscaster.xyz/hotlink-ok/favicon.png',
}

export const generateURLFCFrameEmbed = ({
  featureImage = '', 
  url,
  buttonTitle = 'Open App',
  appName = 'FOSSCaster.xyz'
}: {
  featureImage?: string,
  url: string,
  buttonTitle?: string,
  appName?: string
}) => {
    const FrameEmbed = {
        // Frame spec version. Required.
        // Example: "next"
        version: 'next',
      
        // Frame image.
        // Max 512 characters.
        // Image must be 3:2 aspect ratio and less than 10 MB.
        // Example: "https://yoink.party/img/start.png"
        imageUrl: featureImage || FrameConfig.imageUrl,
      
        // Button attributes
        button: {
          // Button text.
          // Max length of 32 characters.
          // Example: "Yoink Flag"
          title: buttonTitle,
      
          // Action attributes
          action: {
            // Action type. Must be "launch_frame".
            type: 'launch_frame',
      
            // App name
            // Max length of 32 characters.
            // Example: "Yoink!"
            name: appName,
      
            // Frame launch URL.
            // Max 512 characters.
            // Example: "https://yoink.party/"
            url,
      
            // Splash image URL.
            // Max 512 characters.
            // Image must be 200x200px and less than 1MB.
            // Example: "https://yoink.party/img/splash.png"
            splashImageUrl: FrameConfig.splashImageUrl,
      
            // Hex color code.
            // Example: "#eeeee4"
            splashBackgroundColor: '#35303f'
          }
        }
      };
     return JSON.stringify(FrameEmbed)
}