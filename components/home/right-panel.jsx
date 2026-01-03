import React from 'react'
import Anketa from '../page/Anketa'
import Reviews from '../page/Reviews'
import Rating from '../page/Rating'
import Reports from '../page/Reports'
import Payments from '../page/Payments'
import { FaSearch } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";

export default function RightPanel({ step = 0 }) {
    const renderContent = () => {
        switch (step) {
            case 0:
                return <Anketa />
            case 1:
                return <Reviews />
            case 2:
                return <Rating />
            case 3:
                return <Reports />
            case 4:
                return <Payments />
            default:
                return <Anketa />
        }
    }

    return (
        <div>


            {renderContent()}
        </div>
    )
}
