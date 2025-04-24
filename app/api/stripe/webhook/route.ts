import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel-subscription";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req : NextRequest){
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("Stripe-Signature")

    if(!signature || !secret){
        return NextResponse.json({error: "Signature not found or secret"}, {status: 400})
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    try{
        switch (event.type) {
            case "checkout.session.completed": //pagemento realizado se status = paid
                const metadata = event.data.object.metadata
                if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID){
                    await handleStripePayment(event)
                }
                if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID){
                    await handleStripeSubscription(event)
                }
                break;
            case "checkout.session.expired": //expirou o tempo de pagamento
                console.log("Enviar um email para o usuario avisando que o pagamento expirou")
                break;
            case "checkout.session.async_payment_succeeded": //boleto pago
                console.log("Enviar um email para o usuario avisando que o pagamento foi realizado")
        
                break;
            case "checkout.session.async_payment_failed": //boleto falhou
                console.log("Enviar um email para o usuario avisando que o pagamento falhou")
        
                break;
            case "customer.subscription.created": //criou a assinatura
                console.log("Mensagem de boas vindas, por que o cliente acabou de assinar")
        
                break;
            case "customer.subscription.deleted": //cancelou a assinatura
                await handleStripeCancelSubscription(event)
                break;
            default:
                console.log(`unhadle event type ${event.type}`)
        }

        return NextResponse.json({message: "Webhook recived"}, {status: 200})

    }catch (error){
        console.log("Error in webhook", error)
        return NextResponse.error()
    }
  
  
}

