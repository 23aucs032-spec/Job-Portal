/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect,useState} from "react";
import AdminSidebar from "./AdminSidebar";

const AdminJobs = ()=>{

const [jobs,setJobs] = useState([]);

const token = localStorage.getItem("adminToken");

useEffect(()=>{

fetch("http://localhost:5000/api/admin/jobs",{

headers:{Authorization:`Bearer ${token}`}

})
.then(res=>res.json())
.then(data=>setJobs(data));

},[]);

const approve = async(id)=>{
await fetch(`http://localhost:5000/api/admin/jobs/approve/${id}`,{
method:"PUT",
headers:{Authorization:`Bearer ${token}`}
});
};

const reject = async(id)=>{
await fetch(`http://localhost:5000/api/admin/jobs/reject/${id}`,{
method:"PUT",
headers:{Authorization:`Bearer ${token}`}
});
};

return(

<div className="flex">

<AdminSidebar/>

<div className="ml-64 p-10 text-white">

<h2 className="text-3xl mb-6">Job Posts</h2>

{jobs.map(job=>(

<div key={job._id} className="bg-gray-900 p-6 mb-4 rounded">

<h3 className="text-xl">{job.title}</h3>

<p>{job.company}</p>

<div className="mt-4 flex gap-4">

<button
onClick={()=>approve(job._id)}
className="bg-green-500 px-4 py-2 rounded"
>
Approve
</button>

<button
onClick={()=>reject(job._id)}
className="bg-yellow-500 px-4 py-2 rounded"
>
Reject
</button>

</div>

</div>

))}

</div>

</div>

);

};

export default AdminJobs;