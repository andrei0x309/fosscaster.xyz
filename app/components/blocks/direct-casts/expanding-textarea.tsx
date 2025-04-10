import { useRef, useEffect } from "react"

interface ExpandingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function ExpandingTextarea({ value, onChange, className = "", ...props }: ExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Adjust height on value change
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto"
      // Set the height to the scrollHeight to expand the textarea
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      rows={1}
      className={`outline-none ${className}`}
      {...props}
    />
  )
}

