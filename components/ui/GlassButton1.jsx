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
        rounded-xl transition-all duration-200
        ${active
          ? 'bg-white text-black'
          : 'bg-white/20 text-white hover:bg-white/40'}
      `}
    >
      {text}
    </button>
  )
}
