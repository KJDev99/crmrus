'use client'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Telefon raqamni formatlash funksiyasi
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        let formatted = "";

        if (numbers.length > 0) formatted += "(" + numbers.slice(0, 2);
        if (numbers.length >= 3) formatted += ") " + numbers.slice(2, 5);
        if (numbers.length >= 6) formatted += "-" + numbers.slice(5, 7);
        if (numbers.length >= 8) formatted += "-" + numbers.slice(7, 13);

        return formatted;
    };

    // Telefon inputini o'zgartirish
    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhone(e.target.value);
        setPhone(formattedPhone);
    };

    // Login funksiyasi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Telefon raqamni formatdan faqat raqamlarga o'tkazish
        const cleanPhone = phone.replace(/\D/g, "");

        try {
            const response = await axios.post(
                "https://api.reiting-profi.ru/api/v1/accounts/login-admin/",
                {
                    phone: cleanPhone,
                    password: password,
                }
            );

            console.log("Успешный вход:", response.data);

            // Tokenlarni saqlash
            if (response.data.tokens) {
                localStorage.setItem("accessToken", response.data.tokens.access);
                localStorage.setItem("refreshToken", response.data.tokens.refresh);
                localStorage.setItem("userLoggedIn", "true");
            }

            // Asosiy sahifaga yo'naltirish
            router.push("/");

        } catch (err) {
            console.error("Ошибка входа:", err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError("Неверный номер телефона или пароль");
                } else if (err.response.status === 405) {
                    setError("Ошибка сервера: Метод запроса не поддерживается");
                } else {
                    setError(err.response.data?.message || "Ошибка при входе в систему");
                }
            } else if (err.request) {
                setError("Не удалось подключиться к серверу. Проверьте интернет соединение");
            } else {
                setError("Ошибка при отправке запроса");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="p-12 rounded-4xl bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
                <h1 className="text-[26px] font-bold mb-10 text-center text-white">
                    Вход в Административную панель
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Телефон Input */}
                    <div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Введите номер телефона"
                                value={phone}
                                onChange={handlePhoneChange}
                                className="px-5 w-[480px] h-[90px] text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Пароль Input */}
                    <div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-5 pr-14 w-[480px] h-[90px] text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                ) : (
                                    <Eye className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Сообщение об ошибке */}
                    {error && (
                        <div className="text-3xl text-center p-5 rounded-2xl bg-red-900/30 text-red-400 border border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Кнопка входа */}
                    <button
                        type="submit"
                        disabled={loading || !phone || !password}
                        className="w-full h-[90px] text-3xl font-bold rounded-3xl transition-all duration-300 mt-6 relative overflow-hidden bg-glass1 hover:bg-glass2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mr-4"></div>
                                Вход...
                            </div>
                        ) : (
                            "Войти"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}