"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
    const { createPaymetStipeCheckout, createSubscriptionCheckout, handleCreateStripePortal} = useStripe()
    return(
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Pagementos</h1>
            <button type="button" className="border rounded-md px-1 cursor-pointer" onClick={() => createPaymetStipeCheckout({
                testId: "123"
}           )}>Criar Pagamentos Stipe</button>
            <button type="button" className="border rounded-md px-1 cursor-pointer" onClick={() => createSubscriptionCheckout({
                testId: "123"
}           )}>
                Criar Assinatura Stipe
            </button>
            <button type="button" className="border rounded-md px-1 cursor-pointer" onClick={() => handleCreateStripePortal()}>
                Criar Portal de Pagamentos
            </button>
        </div>
    )
}