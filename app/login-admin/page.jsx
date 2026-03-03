'use client'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        let formatted = "";

        if (numbers.length > 0) formatted += "(" + numbers.slice(0, 2);
        if (numbers.length >= 3) formatted += ") " + numbers.slice(2, 5);
        if (numbers.length >= 6) formatted += "-" + numbers.slice(5, 7);
        if (numbers.length >= 8) formatted += "-" + numbers.slice(7, 13);

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhone(e.target.value);
        setPhone(formattedPhone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

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

            if (response.data.tokens) {
                localStorage.setItem("accessToken", response.data.tokens.access);
                localStorage.setItem("refreshToken", response.data.tokens.refresh);
                localStorage.setItem("userLoggedIn", "true");
            }

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
        <div className="min-h-screen flex items-center justify-center">
            <div className="
                p-6 rounded-3xl mx-4 w-full max-w-sm
                bg-gray-800/50 border border-gray-700 backdrop-blur-sm
                sm:p-12 sm:rounded-4xl sm:mx-0 sm:w-auto sm:max-w-none
            ">
                <h1 className="
                    text-[18px] font-bold mb-6 text-center text-white
                    sm:text-[26px] sm:mb-10
                ">
                    Вход в Административную панель
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Введите номер телефона"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="
                                w-full h-[56px] px-4 text-[16px] rounded-2xl outline-none
                                text-yellow-400 bg-white/10 placeholder:text-yellow-400/70
                                border border-white/30 focus:border-yellow-400 transition-colors
                                sm:w-[480px] sm:h-[90px] sm:text-[28px] sm:rounded-3xl sm:px-5
                            "
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="
                                w-full h-[56px] px-4 pr-12 text-[16px] rounded-2xl outline-none
                                text-yellow-400 bg-white/10 placeholder:text-yellow-400/70
                                border border-white/30 focus:border-yellow-400 transition-colors
                                sm:w-[480px] sm:h-[90px] sm:text-[28px] sm:rounded-3xl sm:px-5 sm:pr-14
                            "
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-8"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-yellow-400/70 hover:text-yellow-400 transition-colors sm:w-8 sm:h-8" />
                            ) : (
                                <Eye className="w-5 h-5 text-yellow-400/70 hover:text-yellow-400 transition-colors sm:w-8 sm:h-8" />
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="
                            text-sm text-center p-3 rounded-xl
                            bg-red-900/30 text-red-400 border border-red-700
                            sm:text-3xl sm:p-5 sm:rounded-2xl
                        ">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !phone || !password}
                        className="
                            w-full h-[52px] text-base font-bold rounded-2xl mt-3
                            transition-all duration-300 relative overflow-hidden
                            bg-glass1 hover:bg-glass2 disabled:opacity-50 disabled:cursor-not-allowed
                            sm:h-[90px] sm:text-3xl sm:rounded-3xl sm:mt-6
                        "
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:w-10 sm:h-10 sm:border-4 sm:mr-4"></div>
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