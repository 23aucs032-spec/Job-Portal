import {useEffect,useState} from "react";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = ()=>{

const [users,setUsers] = useState([]);

const token = localStorage.getItem("adminToken");

useEffect(()=>{

fetch("http://localhost:5000/api/admin/users",{

headers:{Authorization:`Bearer ${token}`}

})
.then(res=>res.json())
.then(data=>setUsers(data));

},[]);

const deleteUser = async(id)=>{

await fetch(`http://localhost:5000/api/admin/users/${id}`,{

method:"DELETE",

headers:{Authorization:`Bearer ${token}`}

});

setUsers(users.filter(u=>u._id !== id));

};

return(

<div className="flex">

<AdminSidebar/>

<div className="ml-64 p-10 text-white">

<h2 className="text-3xl mb-6">Users</h2>

<table className="w-full">

<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{users.map(user=>(

<tr key={user._id}>

<td>{user.fullName}</td>

<td>{user.email}</td>

<td>

<button
onClick={()=>deleteUser(user._id)}
className="bg-red-500 px-4 py-2 rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

};

export default AdminUsers;