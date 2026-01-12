const API_BASE_URL = 'https://api.reiting-profi.ru/api/v1/accounts';

export const authService = {
    // 1. Telefon raqamni tekshirish (yangi user yoki eski)
    async checkPhone(phone) {
        const response = await fetch(`${API_BASE_URL}/login/check-phone/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка при проверке телефона');
        }

        return response.json();
    },

    // 2. SMS kodni tekshirish
    async verifyCode(phone, code) {
        const response = await fetch(`${API_BASE_URL}/login/verify-code/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, code })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Неверный код');
        }

        return response.json();
    },

    // 3. Login qilish (parol bilan)
    async login(phone, password = '') {
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка входа');
        }

        return response.json();
    },

    // Token saqlash
    saveTokens(accessToken, refreshToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    },

    // Token olish
    getAccessToken() {
        return localStorage.getItem('access_token');
    },

    getRefreshToken() {
        return localStorage.getItem('refresh_token');
    },

    // Logout
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};