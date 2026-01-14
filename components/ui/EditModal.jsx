import React from 'react'
import { IoClose } from 'react-icons/io5'

export default function EditModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[#1a1f3a] rounded-lg w-[95%] max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20 bg-[#122161]">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <IoClose size={24} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
            </div>
        </div>
    )
}