import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req : NextRequest){
    const { testeId, userEmail } = await req.json();
    try{
        const preference = new Preference(mpClient);
        const createdPreference = await preference.create({
            body:{
                external_reference: testeId, //id do pedido no sistema
                metadata:{
                    testeId, //essa variavel é convertida para snake_case -> test_id
                },
                ...(userEmail && { payer: { email: userEmail }}),
                items:[
                    {
                        id: "",
                        description: "Teste de pagamento",
                        title: "Teste de pagamento",
                        quantity: 1,
                        unit_price: 1, //valor em centavos
                        currency_id: "BRL", //moeda do Brasil
                        category_id: "services", //categoria do produto
                    }
                ],
                payment_methods:{
                    installments: 12, //parcelas
                    // excluded_payment_methods:[
                    //     {id: "bolbradesco"},
                    //     {id: "pec"},
                    // ],
                    // excluded_payment_types:[
                    //     {id: "debit_card"},
                    //     {id: "credit_card"},
                    // ],
                },
                auto_return: "approved", //retorno automático
                back_urls:{
                    success: `${process.env.NEXT_PUBLIC_URL}/api/mercado-pago/pending`, //url de sucesso
                    pending: `${process.env.NEXT_PUBLIC_URL}/api/mercado-pago/pending`, //url de pendência
                    failure: `${process.env.NEXT_PUBLIC_URL}/api/mercado-pago/pending`, //url de falha
                },
            }
        });

        if(!createdPreference.id){
            return NextResponse.json(
                { error: "Error creating checkout preference" },
                { status: 500 }
            )
        }
        
        return NextResponse.json(
            {   preferenceId: createdPreference.id,
                initPoint: createdPreference.init_point, //init_point é a url de pagamento
                status: 200 
            }
        )

    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "Error creating checkout preference" },
            { status: 500 }
        )
    }
}