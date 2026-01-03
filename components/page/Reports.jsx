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
    start: '2025-11-10',
    end: '2025-11-16'
  });

  // Backenddan ma'lumot olish
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Токен не найден. Пожалуйста, войдите в систему.");
      }

      const response = await fetch(`https://api.reiting-profi.ru/api/v1/events/reports/?start=${period.start}&end=${period.end}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Backend ma'lumotlarini Chart.js formatiga o'tkazish
      const transformedData = {
        labels: data.dates || generateDateLabels(period.start, period.end),
        datasets: [
          {
            label: 'Поставщики',
            data: data.suppliers || [45, 48, 50, 50, 49, 50, 50],
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          },
          {
            label: "Ремонт",
            data: data.repair || [20, 22, 25, 24, 26, 28, 30],
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Дизайн',
            data: data.design || [40, 42, 44, 45, 45, 45, 45],
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          },
          {
            label: 'Медиа',
            data: data.media || [35, 38, 40, 42, 43, 44, 45],
            borderColor: '#9966ff',
            backgroundColor: 'rgba(153, 102, 255, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false
          }
        ]
      };

      setChartData(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Sana label'larini generatsiya qilish
  const generateDateLabels = (startDate, endDate) => {
    const labels = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    let current = new Date(start);
    while (current <= end) {
      labels.push(current.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));
      current.setDate(current.getDate() + 1);
    }

    return labels;
  };

  useEffect(() => {
    fetchData();
  }, [period]);

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
            size: 14
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
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: 50,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 12
          },
          callback: function (value) {
            return value;
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#ffffff'
      }
    }
  };

  // Sana o'zgartirish handleri
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPeriod(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">ОТЧЕТЫ</h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="flex-1">
            <label className="block mb-2 font-medium text-white">Дата начала:</label>
            <input
              type="date"
              name="start"
              value={period.start}
              onChange={handleDateChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent text-white"
            />
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-medium text-white">Дата окончания:</label>
            <input
              type="date"
              name="end"
              value={period.end}
              onChange={handleDateChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-transparent text-white"
            />
          </div>

          {/* <div className="flex items-end">
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Обновить
            </button>
          </div> */}
        </div>
      </div>

      <div className="h-[500px] relative">
        {chartData && <Line data={chartData} options={options} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="font-semibold text-white mb-2">Поставщики</div>
          <div className="text-3xl font-bold text-[#4bc0c0] mb-1">50</div>
          <div className="text-white/80 text-sm">компаний</div>
        </div>

        <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="font-semibold text-white mb-2">Группа Ремонт</div>
          <div className="text-3xl font-bold text-[#ff6384] mb-1">30</div>
          <div className="text-white/80 text-sm">компаний</div>
        </div>

        <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="font-semibold text-white mb-2">Группа Дизайн</div>
          <div className="text-3xl font-bold text-[#36a2eb] mb-1">45</div>
          <div className="text-white/80 text-sm">компаний</div>
        </div>

        <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="font-semibold text-white mb-2">Группа Медиа</div>
          <div className="text-3xl font-bold text-[#9966ff] mb-1">45</div>
          <div className="text-white/80 text-sm">компаний</div>
        </div>
      </div>
    </div>
  );
};

export default MultiGroupLineChart;