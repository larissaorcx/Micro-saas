import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    //estamos no lado do servidor
    const session = await auth()

    if(!session){
        redirect("/login")
        console.log(session)
    }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Protected Dashboard</h1>
      <p>{session?.user?.email ? session?.user?.email : "Usuário não está logado"}</p>
      {
        session.user?.email && "larissaorcx@gmail.com" &&(
            <form action={handleAuth}>
                <button type="submit" className="rounded-md border px-2 cursor-pointer ">Logout</button>
            </form>
        )
      }
    </div>
  );
}