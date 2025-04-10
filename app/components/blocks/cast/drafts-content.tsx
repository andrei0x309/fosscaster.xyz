export const DraftsContent = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 border border-dashed border-neutral-700 rounded-md flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-neutral-800 rounded"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No drafts yet</h3>
        <p className="text-neutral-400">You can stash casts here to post later.</p>
      </div>
    )
  }