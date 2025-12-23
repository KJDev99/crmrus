export default function ReviewItem({ status = "positive" }) {
  return (
    <div className="w-full border-t border-white/60  px-6 py-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-6 w-full">
          <div className="min-w-[160px] text-white">
            <p className="font-['Jeju_Myeongjo'] text-[18px] leading-[100%]">
              Екатерина
            </p>
            <p className="mt-1 font-['Jeju_Myeongjo'] text-[16px] text-white/80">
              Поставщику
            </p>
            <div className="mt-4 flex items-center gap-2 text-[14px] text-white/80">
              {status == "positive" ? "⭐" : "☆"}
              <span>
                {status === "positive"
                  ? "положительный"
                  : "конструктивный"}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-[#3f4763] p-4 text-white font-['Jeju_Myeongjo'] text-[16px] leading-[140%]">
            Здравствуйте, хочу оставить отзыв благодарности,
            поставщику ....
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[130px]">
          <button className="rounded-full bg-[#2e9c63] px-5 py-2 text-white text-[14px] hover:opacity-90">
            одобрить
          </button>
          <button className="rounded-full bg-[#9b4b6a] px-5 py-2 text-white text-[14px] hover:opacity-90">
            отклонить
          </button>
        </div>
      </div>
    </div>
  );
}
