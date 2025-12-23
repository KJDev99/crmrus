import Image from 'next/image';
const data = [
  { id: 91919191, name: 'Екатерина', group: 'Поставщик', phone: '61489415471', date: '22.05.2025' },
  { id: 91919191, name: 'Екатерина', group: 'Ремонт', phone: '61489415471', date: '22.05.2025' },
  { id: 91919191, name: 'Екатерина', group: 'Дизайн', phone: '61489415471', date: '22.05.2025' },
  { id: 91919191, name: 'Екатерина', group: 'Медиа', phone: '61489415471', date: '22.05.2025' },
];
export default function Anketa() {
  return (
    <div className=" text-white">

       <div className="  ml-[90px] mb-[63px] py-8">
        <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-[white]">АНКЕТЫ</h1>
      </div>
      <div className="px-6 overflow-x-auto">
        <table className=" ml-[30px] w-[1036.023193359375px]">
          <thead>
            <tr className="text-left text-[white] text-sm">
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">ID</th>
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Название организации / ФИ</th>
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Группа</th>
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Телефон</th>
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Дата заявки</th>
              <th className="pb-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
     <tr key={index} className="text-white hover:bg-gray-750">
  <td className="py-[32px] px-4 font-normal text-[20px] leading-[100%] tracking-normal border-b border-white">{row.id}</td>
  <td className="py-[32px] px-4 font-normal text-[20px] leading-[100%] tracking-normal border-b border-white">{row.name}</td>
  <td className="py-[32px] px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic border-b border-white">{row.group}</td>
  <td className="py-[32px] px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic border-b border-white">{row.phone}</td>
  <td className="py-[32px] px-4 font-normal not-italic text-[20px] leading-[100%] tracking-normal border-b border-white">{row.date}</td>
  <td className="py-[32px] px-4  border-b border-white text-right">
    <button className="font-normal not-italic text-[20px] leading-[100%] tracking-normal bg-[#71707099] w-[166px] h-[44px] rounded-[25px]">
      ПОСМОТРЕТЬ
    </button>
  </td>
</tr>

            ))}
          </tbody>
        </table>
      </div>
      <div className='ml-[39px] mt-[265px]'>
        <button className='w-[166px] h-[44px] rounded-[25px] bg-[#D7B7068A] font-normal not-italic text-[25px] leading-[100%] tracking-normal'>АРХИВ</button>
      </div>
    </div>
  );
}