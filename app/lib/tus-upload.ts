import type React from 'react'

export const uploadFileWithTus = async ({
    file,
    cloudflareUploadUrl,
    setUploadProgress
}:{
    file: File,
    cloudflareUploadUrl: string,
    setUploadProgress: React.Dispatch<React.SetStateAction<string>>
}) => {
    let resolveFinish = () => {}
    const finish = new Promise((resolve) => {
        resolveFinish = resolve as any
    })
    const lib = await import('tus-js-client')
    const upload = new lib.Upload(file, {
    endpoint: cloudflareUploadUrl,
    headers: {},
    metadata: {
        name: file.name,
        filetype: file.type,
    },
    chunkSize: 5242880,
    retryDelays: [0, 1000, 3000, 5000],

    onProgress: function(bytesUploaded, bytesTotal) {
      const percentage = (bytesUploaded / bytesTotal) * 100;
      setUploadProgress(percentage.toFixed(2));
    },

    onSuccess: function() {
      resolveFinish()
    },

    onError: function(error) {
      console.log("Upload failed:");
      console.error(error);
      resolveFinish()
    }
  });

  // 4. Attempt to resume or start the upload
  // Check if there are uploads pending from previous attempts for this file.
  // tus-js-client will automatically try to resume the upload if possible.
  upload.findPreviousUploads().then(function (previousUploads) {
      if (previousUploads.length) {
          console.log("Resuming upload...");
          upload.resumeFromPreviousUpload(previousUploads[0])
      } else {
          console.log("Starting new upload...");
          // You would typically get the uploadUrl from your backend BEFORE this point
          // If you were initiating from the client (NOT RECOMMENDED DUE TO API TOKEN)
          // you would call upload.start() without resumeFromPreviousUpload
          // But since we have the uploadUrl, we just start.
      }

      // Start the upload
      upload.start();
  });
  await finish
}