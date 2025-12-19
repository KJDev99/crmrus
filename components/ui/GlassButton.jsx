export default function GlassButton({ text,w,h  }) {
  return (
    <button
      className={`
       ${w?w:'w-[480px]'}
       ${h?h:'h-[105px]'}
        rounded-[18px]
        text-white text-[37px] tracking-widest
        bg-white/10
        backdrop-blur-[70px]
        border border-transparent
        transition-all
        hover:bg-white/20
      `}
      style={{
        boxShadow: "0px 0px 30px -9px #FFFFFF66 inset",
        borderImageSource: `
          radial-gradient(
            120.73% 120.73% at -10.62% 0%,
            rgba(255, 250, 250, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 100%
          ),
          radial-gradient(
            116.46% 116.46% at 0% 9.52%,
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0.6) 100%
          )
        `,
        borderImageSlice: 1,
      }}
    >
      {text}
    </button>
  );
}
