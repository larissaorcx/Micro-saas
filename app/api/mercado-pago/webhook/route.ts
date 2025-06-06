import mpClient, { validateMercadoPagoWebhook } from "@/app/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/hangle-mercado-pago-payment";
import { Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try{
        validateMercadoPagoWebhook(req)
        const body = await req.json();

        const { type, data } = body;

        //Webhook aqui
        switch(type){
            case "payment":
                const payment = new Payment(mpClient);
                const paymentData = await payment.get({id: data.id});
                if(paymentData.status === "approved" || paymentData.date_approved !== null){
                    await handleMercadoPagoPayment(paymentData);
                }
                break;
            case "subscription":
            break;
            default:
                console.log("Esse evento não é suportado");
        }


        return NextResponse.json({recived: true}, { status: 200 });

    }catch(error){
        console.log(error)
        return NextResponse.error()
    }
}