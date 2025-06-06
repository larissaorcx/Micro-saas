import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse){
    const metadatta = paymentData.metadata;
    const userEmail = metadatta?.user_email;
    const userId = metadatta?.user_id;

    console.log("Pagamento com sucesso", paymentData, userEmail, userId)

}