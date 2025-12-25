export default function Rating() {
  const data = [
    { name: 'Екатерина', group: 'Дизайнер', total: 190, positive: 180, constructive: 10 },
    { name: 'Екатерина', group: 'Поставщик', total: 50, positive: 45, constructive: 5 },
    { name: 'Екатерина', group: 'Медиа', total: 50, positive: 49, constructive: 1 },
    { name: 'Екатерина', group: 'Ремонт', total: 16, positive: 12, constructive: 4 },
    { name: 'Екатерина', group: 'Медиа', total: 50, positive: 25, constructive: 25 },
    { name: 'Екатерина', group: 'Ремонт', total: 16, positive: 16, constructive: 0 },
  ]

  return (
    <div className="w-full bg-navy text-white font-jeju">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-line text-left text-[18px]">
            <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">Название организации ФИ</th>
            <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">Группа</th>
            <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 text-center">
              Общий<br />Рейтинг
            </th>
            <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 text-center">
              Положительный<br />Рейтинг
            </th>
            <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 text-center">
              Конструктивный<br />Рейтинг
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b border-line text-[22px]">
              <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                {item.name}
              </td>

              <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">{item.group}</td>

              <td className="py-6 px-6">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="37"
                    height="35"
                    viewBox="0 0 37 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.0703 0L22.3361 13.1287H36.1404L24.9725 21.2426L29.2382 34.3713L18.0703 26.2574L6.90239 34.3713L11.1682 21.2426L0.000238419 13.1287H13.8045L18.0703 0Z"
                      fill="#D7B706"
                    />
                  </svg>
                  {item.total}
                </div>
              </td>

              <td className="py-6 px-6">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="37"
                    height="35"
                    viewBox="0 0 37 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.0703 0L22.3361 13.1287H36.1404L24.9725 21.2426L29.2382 34.3713L18.0703 26.2574L6.90239 34.3713L11.1682 21.2426L0.000238419 13.1287H13.8045L18.0703 0Z"
                      fill="#D7B706"
                    />
                  </svg>
                  {item.positive}
                </div>
              </td>

              <td className="py-6 px-6">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    width="35"
                    height="33"
                    viewBox="0 0 35 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.5209 12.1599L24.0009 20.0399L28.3609 32.7999L17.2809 24.9599L6.16086 32.7999L10.5209 20.0399L0.00085941 12.1599H13.1609L17.2809 -0.00013876L21.3609 12.1599H34.5209ZM29.6409 13.9599H20.2009L17.2809 5.63986L14.3209 13.9599H4.88086L12.4809 19.3999L9.40086 27.9199L17.2809 22.5599L25.1209 27.9199L22.0409 19.3999L29.6409 13.9599Z"
                      fill="white"
                    />
                  </svg>
                  {item.constructive}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
