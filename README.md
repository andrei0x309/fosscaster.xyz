# fosscaster.xyz

This is a FOSS working UI recreated after the Warpcast website, it's in development and uses the same API as warpcast.com.

Current features:

- Sign up to Farcaster network using your EOA
- Login to Farcaster network using The EOA that owns the FID or by providing a Warpcast auth token
- Cast, like, recast, quote, bookmark, delete cast
- Bookmark casts page
- Settings page
- Multi accounts
- Interacting with mini-apps including, doing TXs with your EOA
- Uploading videos(if you account is allowed) and upload images
- Update your farcaster profile
- Add Mini apps as favorites and enable disable notifications for them
- Notifications page
- Custom feeds
- Channel feeds
- Explore page
- Search (un unauthenticated / guest mode)
- Website full in guest mode, connect modal will appear only when you try to do an action that requires authentification
- Disable Waprcast trackers
- Setting to disable trending feed ( which is basically Warpcast ads)
- The primary unauthenticated feed is `cryptoleft`
- YouTube embeds (watch YouTube videos without leaving the website )
- Support for rendering multiple video formats not just .m3u8 which is the only video format supported by Warpcast
- DMs and group chats without trackers
- Commit attestation proving what code you are running
- Multi-mini-app runs up to 6 Mini apps concomitantly
- Animated avatars
- Compose cast intent
- Storage usage widget
- Profile pages with the same routing system as Warpcast (/username)
- Works as a mini app too

## Notes

- It's still in heavy development but, is pretty usable, you might find a bug here or there, PRs are welcome, will try to add other features in the future.

## Other farcaster projects I made

You can check this page [https://flashsoft.eu/projects/technology/farcaster](https://flashsoft.eu/projects/technology/farcaster) is not complete.

## Changelog

[Changelog.md](./changelog.md)
