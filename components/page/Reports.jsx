'use client'
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MultiGroupLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState({
    start: '',
    end: ''
  });
  const [currentTotals, setCurrentTotals] = useState({
    total: 0,
    supplier: 0,
    repair: 0,
    design: 0,
    media: 0
  });

  // Boshlang'ich sanalarni belgilash (oxirgi 30 kun)
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // Oxirgi 30 kun

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setPeriod({
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
  }, []);

  // Backenddan ma'lumot olish
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Токен не найден. Пожалуйста, войдите в систему.");
      }

      const response = await fetch(`https://api.reiting-profi.ru/api/v1/events/reports/?end_date=${period.end}&start_date=${period.start}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log("API Response:", data);

      // Joriy total sonlarni saqlash
      if (data.current_totals) {
        setCurrentTotals(data.current_totals);
      }

      // Daily trends ma'lumotlarini olish
      const dailyTrends = data.daily_trends || [];

      // Sanalarni formatlash (kun/oy)
      const labels = dailyTrends.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit'
        });
      });

      // Har bir guruh uchun ma'lumotlarni ajratib olish
      const supplierData = dailyTrends.map(item => item.supplier || 0);
      const repairData = dailyTrends.map(item => item.repair || 0);
      const designData = dailyTrends.map(item => item.design || 0);
      const mediaData = dailyTrends.map(item => item.media || 0);
      const totalData = dailyTrends.map(item => item.total || 0);

      // Chart.js uchun ma'lumotlarni tayyorlash
      const transformedData = {
        labels: labels,
        datasets: [
          {
            label: 'Поставщики',
            data: supplierData,
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#4bc0c0',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: "Ремонт",
            data: repairData,
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#ff6384',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'Дизайн',
            data: designData,
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#36a2eb',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'Медиа',
            data: mediaData,
            borderColor: '#9966ff',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointBackgroundColor: '#9966ff',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          },
          {
            label: 'Общий итог',
            data: totalData,
            borderColor: '#ff9f40',
            backgroundColor: 'rgba(255, 159, 64, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            fill: false,
            borderDash: [5, 5],
            pointBackgroundColor: '#ff9f40',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }
        ]
      };

      setChartData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Sana o'zgartirganda ma'lumotlarni yangilash
  useEffect(() => {
    if (period.start && period.end) {
      fetchData();
    }
  }, [period]);

  // Sana o'zgartirish handleri
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPeriod(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tezkor davr tanlash
  const handleQuickPeriod = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setPeriod({
      start: formatDate(startDate),
      end: formatDate(endDate)
    });
  };

  // Chart konfiguratsiyasi
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#ffffff',
          font: {
            size: 14,
            family: 'Arial, sans-serif'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
          drawTicks: true
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
            family: 'Arial, sans-serif'
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
            family: 'Arial, sans-serif'
          },
          callback: function (value) {
            return value;
          },
          stepSize: 5
        },
        title: {
          display: true,
          text: 'Количество компаний',
          color: '#ffffff',
          font: {
            size: 14,
            family: 'Arial, sans-serif'
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#ffffff'
      },
      line: {
        tension: 0.3
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <div className="text-xl">Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-white">
        <div className="text-xl text-red-400 mb-4">Ошибка загрузки данных</div>
        <div className="text-gray-400">{error}</div>
        <button
          onClick={fetchData}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">ОТЧЕТЫ ПО КОМПАНИЯМ</h2>

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => handleQuickPeriod(7)}
            className={`px-4 py-2 rounded-lg ${period.end === new Date().toISOString().split('T')[0] && (new Date(period.end) - new Date(period.start)) === 6 * 24 * 60 * 60 * 1000 ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
          >
            Последние 7 дней
          </button>
          <button
            onClick={() => handleQuickPeriod(14)}
            className={`px-4 py-2 rounded-lg ${period.end === new Date().toISOString().split('T')[0] && (new Date(period.end) - new Date(period.start)) === 13 * 24 * 60 * 60 * 1000 ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
          >
            Последние 14 дней
          </button>
          <button
            onClick={() => handleQuickPeriod(30)}
            className={`px-4 py-2 rounded-lg ${period.end === new Date().toISOString().split('T')[0] && (new Date(period.end) - new Date(period.start)) === 29 * 24 * 60 * 60 * 1000 ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
          >
            Последние 30 дней
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-white">Дата начала:</label>
            <input
              type="date"
              name="start"
              value={period.start}
              onChange={handleDateChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={period.end}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-medium text-white">Дата окончания:</label>
            <input
              type="date"
              name="end"
              value={period.end}
              onChange={handleDateChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={period.start}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      {chartData && (
        <>
          <div className="h-[500px] relative">
            <Line data={chartData} options={options} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="font-semibold text-white mb-2">Всего компаний</div>
              <div className="text-3xl font-bold text-[#ff9f40] mb-1">{currentTotals.total}</div>
              <div className="text-white/80 text-sm">за период</div>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="font-semibold text-white mb-2">Поставщики</div>
              <div className="text-3xl font-bold text-[#4bc0c0] mb-1">{currentTotals.supplier}</div>
              <div className="text-white/80 text-sm">компаний</div>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="font-semibold text-white mb-2">Ремонт</div>
              <div className="text-3xl font-bold text-[#ff6384] mb-1">{currentTotals.repair}</div>
              <div className="text-white/80 text-sm">компаний</div>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="font-semibold text-white mb-2">Дизайн</div>
              <div className="text-3xl font-bold text-[#36a2eb] mb-1">{currentTotals.design}</div>
              <div className="text-white/80 text-sm">компаний</div>
            </div>

            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="font-semibold text-white mb-2">Медиа</div>
              <div className="text-3xl font-bold text-[#9966ff] mb-1">{currentTotals.media}</div>
              <div className="text-white/80 text-sm">компаний</div>
            </div>
          </div>


        </>
      )}
    </div>
  );
};

export default MultiGroupLineChart;