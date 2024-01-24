import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllUsers from "../components/AllUsers";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const [logoutPop,setLogoutPop]=useState(false);

  const [user, setUser] = useState({
    firstname:"",
    lastname:"",
    username:""
  });

  const navigate = useNavigate();

  const handleLogout=()=>{
    localStorage.removeItem("token")
    navigate("/signin")
  }

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/account/balance",
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setBalance(result.balance);
      } else if (response.status === 403) {
        navigate("/signin");
      } else {
        alert("server error, try again");
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/info",
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setUser(result);
      } else if (response.status === 403) {
        navigate("/signin");
      } else {
        alert("server error, try again");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full">
      <nav className="flex justify-between px-10 py-4 shadow border-b-2 font-poppins ">
        <h1 className=" text-black font-semibold text-xl">Payments App</h1>
        <div className="flex gap-5 items-center">
          <p>Hello, {user.firstname}</p>
          <div className=" w-10 h-10 bg-slate-800 text-white cursor-pointer rounded-full flex justify-center items-center relative" onClick={()=>setLogoutPop(!logoutPop)}>
            {user.firstname.charAt(0)+""+user.lastname.charAt(0)}

            <div className={` ${logoutPop ? "absolute":"hidden"}  transition-all hover:bg-slate-500 shadow bg-slate-700 rounded py-2 px-3 -bottom-14`}>
            <button onClick={handleLogout} >Logout</button>
          </div>
          </div>
          
        </div>
      </nav>
      <div className="w-full p-10 flex flex-col gap-5">
        <h1>Your Balance : ${balance.toFixed(4)}</h1>
        <h1>Users</h1>
        <input
          type="text"
          placeholder="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border-2 outline-none px-2 py-1 rounded text-lg"
        />
        <AllUsers filter={filter} />
      </div>
    </div>
  );
};




export default Dashboard;
