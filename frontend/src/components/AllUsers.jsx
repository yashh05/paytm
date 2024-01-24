import { useEffect, useState } from "react";
import MoneyModel from "./MoneyModel";

const AllUsers = ({ filter }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [sendMoneyId,setSendMoneyId]=useState("");
  const [showMoneyModel,setShowMoneyModel]=useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/bulk?filter=" + filter,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAllUsers(result);
      } else if (response.status === 403) {
        navigate("/signin");
      } else {
        alert("server error, try again");
      }
    };
    fetchUsers();
  }, [filter]);


  const handleSendMoney = (id) =>{
    setSendMoneyId(id);
    setShowMoneyModel(true);
  }

  return (
    <ul className=" w-full flex flex-col gap-5">
      {allUsers.map((user) => {
        return (
          <li
            key={user.username}
            className="flex justify-between items-center list-none"
          >
            <div className="flex gap-2 items-center">
              <div className=" w-10 h-10 bg-slate-800 text-white rounded-full flex justify-center items-center">
                {user.firstname.charAt(0) + "" + user.lastname.charAt(0)}
              </div>
              <h1>{user.firstname + " " + user.lastname}</h1>
            </div>

            <button className=" rounded bg-slate-900 py-2 px-3 text-white " onClick={()=>handleSendMoney(user.id)}>
              Send Money
            </button>
          </li>
        );
      })}
      <MoneyModel showMoneyModel={showMoneyModel} to={sendMoneyId} setShowMoneyModel={setShowMoneyModel} />
    </ul>
  );
};

export default AllUsers;