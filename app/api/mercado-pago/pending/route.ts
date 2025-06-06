import mpClient from "@/app/lib/mercado-pago";
import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment");

    const testeId = searchParams.get("external_reference");

    if(!paymentId || !testeId){
        return NextResponse.json(
            { error: "Missing payment or testeId" },
            { status: 400 }
        )
    }

    const payment = new Payment(mpClient);

    const paymentData = await payment.get({
        id: paymentId
    })

    if(paymentData.status === "approved" || paymentData.date_approved !== null){
        return NextResponse.redirect(new URL(`success`, req.url))
    }

    return NextResponse.redirect(new URL(`/`, req.url))
    
}