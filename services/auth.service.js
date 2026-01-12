import axios from 'axios';

const API_BASE_URL = 'https://api.reiting-profi.ru/api/v1/accounts';

// Axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    // ========== AUTH ENDPOINTS ==========

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

    // ========== PROFILE ENDPOINTS ==========

    // Profile ma'lumotlarini olish
    async getProfile() {
        try {
            const response = await axiosInstance.get('/profile/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при загрузке профиля');
        }
    },

    // Profile ma'lumotlarini yangilash
    async updateProfile(data) {
        try {
            const response = await axiosInstance.put('/profile/', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при обновлении профиля');
        }
    },

    // Profile rasm yuklash
    async uploadProfilePhoto(file) {
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await axiosInstance.put('/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при загрузке фото');
        }
    },

    // ========== PASSWORD ENDPOINTS ==========

    // Parolni o'zgartirish
    async changePassword(oldPassword, newPassword) {
        try {
            const response = await axiosInstance.post('/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при изменении пароля');
        }
    },

    // ========== PHONE CHANGE ENDPOINTS ==========

    // Telefon raqamni o'zgartirish uchun SMS yuborish
    async requestPhoneChange(newPhone) {
        try {
            const response = await axiosInstance.post('/change-phone/', {
                new_phone: newPhone,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Ошибка при отправке SMS');
        }
    },

    // Yangi telefon raqamni SMS kod bilan tasdiqlash
    async verifyPhoneChange(newPhone, code) {
        try {
            const response = await axiosInstance.post('/change-phone/verify/', {
                new_phone: newPhone,
                code: code,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Неверный код подтверждения');
        }
    },

    // ========== TOKEN MANAGEMENT ==========

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