import { useState } from "react";


const MoneyModel = ({to,showMoneyModel,setShowMoneyModel}) => {
const [amount,setAmount]=useState(0);
const [error,setError]=useState("");

const handleTransaction=async ()=>{
  if(!amount || amount===0){
    setError("Please enter an amount!");
    return;
  }    
  const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/account/transfer" ,
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("token"),
          },
          body:JSON.stringify({to,amount})
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Transaction Done")
        setShowMoneyModel(false)
        window.location.reload()
      } else if (response.status === 403) {
        navigate("/signin");
      } else {
        alert("server error, try again");
      }
}

  return (
    <div onClick={()=>setShowMoneyModel(false)} className={`${showMoneyModel? "fixed":"hidden"}  inset-0 flex items-center justify-center bg-[#7E7F7E] bg-opacity-50`}>
      <div onClick={(e) => e.stopPropagation()} className="rounded justify-center items-center gap-5 p-5 w-1/3 bg-white text-black">
        <h1 className="text-center mb-10 text-xl font-semibold uppercase">Send Money</h1>        
        {error ? <p className=" text-center text-red-700">{error}</p>:null} 
        <div className="flex flex-col gap-1">
         <h1 className=" text-lg">Friends Name</h1>
         <p>Amout(in Rs)</p>
         <input type="number" className="p-2 outline-none border-4 rounded w-full" onChange={(e)=> setAmount(e.target.value)} />
         <button className=" bg-green-500 rounded w-full p-2 mt-5 text-white font-semibold text-lg " onClick={handleTransaction}>Send</button>
        </div>
      </div>
    </div>
  );
};
export default MoneyModel;