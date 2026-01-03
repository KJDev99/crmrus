'use client'

export default function GlassButton({
  w,
  h,
  text,
  textsize,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${w} ${h} ${textsize}
        rounded-2xl transition-all duration-200
        ${active
          ? 'bg-glass1 text-black'
          : 'bg-glass2 text-white hover:bg-white/40'}
      `}
    >
      {text}
    </button>
  )
}
