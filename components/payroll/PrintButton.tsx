'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
    return (
        <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-sm hover:shadow-md"
        >
            <Printer className="w-4 h-4" />
            In phiếu lương
        </button>
    )
}
