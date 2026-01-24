import { createClient } from '@/lib/supabase'
import { Suspense } from 'react'

async function InstrumentsData() {
    const supabase = createClient()
    const { data: instruments, error } = await supabase.from('instruments').select()

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Instruments List</h2>
            <ul className="space-y-2">
                {instruments?.map((instrument: any) => (
                    <li key={instrument.id} className="p-4 border rounded-lg">
                        <span className="font-medium">{instrument.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Instruments() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
            <Suspense fallback={<div>Loading instruments...</div>}>
                <InstrumentsData />
            </Suspense>
        </div>
    )
}