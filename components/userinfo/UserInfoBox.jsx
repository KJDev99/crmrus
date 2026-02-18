'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

import DesignDetail from './DesignDetail';
import RepairDetail from "./RepairDetail";
import SupplierDetail from "./SupplierDetail";
import MediaDetail from "./MediaDetail";
// import RepairDetail from './RepairDetail';
// import SupplierDetail from './SupplierDetail';
// import MediaDetail from './MediaDetail';

export default function UserInfoBox() {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMyQuestionnaire();
    }, []);

    const fetchMyQuestionnaire = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/questionnaires/my-questionnaires/",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.results && response.data.results.length > 0) {
                setQuestionnaire(response.data.results[0]);
            }
        } catch (err) {
            toast.error("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161]">
                <BiLoaderAlt className="animate-spin text-[#FFFFFF]" size={64} />
            </div>
        );
    }

    if (!questionnaire) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161] text-white">
                <p>Анкета не найдена</p>
            </div>
        );
    }

    const props = {
        questionnaire,
        onBack: () => router.back()
    };

    switch (questionnaire.request_name) {
        case 'DesignerQuestionnaire':
            return <DesignDetail {...props} />;
        case 'RepairQuestionnaire':
            return <RepairDetail {...props} />;
        case 'SupplierQuestionnaire':
            return <SupplierDetail {...props} />;
        case 'MediaQuestionnaire':
            return <MediaDetail {...props} />;
        default:
            return null;
    }
}