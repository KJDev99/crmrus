export default function ReviewItem({ status = "positive" }) {
  return (
    <div className="w-full border-t border-white/60  px-6 py-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex ">
          <div className="min-w-[160px] text-white">
            <p className="font-normal text-[20px] leading-[1] tracking-normal">
              Екатерина
            </p>
            <p className="font-normal text-[20px] leading-[1] tracking-normal text-white/35 mt-3">
              Поставщику
            </p>
            <div className="mt-18.25 flex items-center gap-2 font-normal text-[12px] leading-[1] tracking-normal">
              {status == "positive" ? "⭐" : "☆"}
              <span>
                {status === "positive"
                  ? "положительный"
                  : "конструктивный"}
              </span>
            </div>
          </div>
        </div>
        <textarea placeholder="  Здравствуйте, хочу оставить отзыв благодарности,
            поставщику ...." className="flex-1 resize-none w-[585px] h-[130px] outline-none bg-[#3f4763] p-4 font-normal text-[18px] leading-[1] tracking-normal text-white">

        </textarea>
        <div className="flex flex-col gap-3 min-w-[130px]">
          <button className="rounded-full bg-[#2e9c63] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal">
            одобрить
          </button>
          <button className="rounded-full bg-[#9b4b6a] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal">
            отклонить
          </button>
        </div>
      </div>
    </div>
  );
}
