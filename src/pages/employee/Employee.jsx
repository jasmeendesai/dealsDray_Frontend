// import { useContext, useState } from 'react'
// import style from './employee.module.css'
// import CreateEmployee from '../../component/createEmployee/CreateEmployee'
// import { AuthContext } from '../../context/authContext'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { makeRequest } from '../../axios'
// import moment from "moment";
// import { useCustomMutation } from '../../customMutation'

// function Employee() {
//   const queryClient = useQueryClient();

//   const {currentUser} = useContext(AuthContext)

//   const [openModal, setOpenModal] = useState(false)
//   const [isEdit, setIsEdit] = useState(null)
//   const [filter, setFilter] = useState({
//     name: "",
//   email: "",
//   date: "",
//   active: "",
//   deactive: ""
//   })

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["employee", filter],
//     queryFn: async () => {
//       try {
//         const params = new URLSearchParams(filter).toString();
//         console.log(params,filter)
//         if(filter !== ""){
//           const response = await makeRequest.get(`/employee/employee?${params}=${filter}`);
//           return response.data;
//         } else{
//           const response = await makeRequest.get("/employee");
//           return response.data;
//         }
          
//       } catch (error) {
//         throw new Error("Failed to fetch posts");
//       }
//     }
//   });

//   console.log(data)

//   const mutationOptions = {
//     onSuccess: () => {
//       console.log('Mutation succeeded');
//     },
//     onError: (error) => {
//       console.error('Mutation error:', error);
//     },
//     onSettled: (data, error, variables) => {
//       console.log('Mutation completed');
//     },
//     queryKey: ['employee'], 
//   };


// const { mutate } = useCustomMutation(queryClient, mutationOptions);

//   const handleDelte = async (id) => {
//     try {
//       await mutate(makeRequest.put.bind(null, '/employee'), {employeeId : id});
//     } catch (error) {
//       console.log(error)
//     }

    
//   }

//   const handleChange = async (e) => {
//     e.preventDefault();
//     // setFilter(prev => (e.target.value.trim()))
//     setFilter(prev => ({ ...prev, name: e.target.value }))
//   }


//   return (
//     <div className={style.container}>
//       {(!openModal && !isEdit) && 
//       <>
//       <h3>Employee List</h3>
//       <div className={style.box}>
//         <h4>Count : {data?.length}</h4>
//         <span onClick={()=>setOpenModal(true)}>Create Employee</span>
//       </div>
//       <div className={style.search}>
//         <label>Search</label>
//         <input type="text" value={filter} placeholder='Enter Search Keyword' onChange={handleChange} />
//       </div>
//       <table>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Image</th>
//           <th>Name</th>
//           <th>Email Id</th>
//           <th>Mobile No</th>
//           <th>Designation</th>
//           <th>Gender</th>
//           <th>Course</th>
//           <th>Created At</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//   {error ? (
//     <tr>
//       <td colSpan="number_of_columns">Something went wrong!</td>
//     </tr>
//   ) : isLoading ? (
//     <tr>
//       <td colSpan="number_of_columns">Loading...</td>
//     </tr>
//   ) : data.map((item, index) => (
//     <tr key={item._id}>
//       <td>{index + 1}</td>
//       <td><img src={`/upload/${item.f_Image}`} alt="" width={90} height={90} /></td>
//       <td>{item.f_Name}</td>
//       <td>{item.f_Email}</td>
//       <td>{item.f_Mobile}</td>
//       <td>{item.f_Designation}</td>
//       <td>{item.f_gender}</td>
//       <td>{item.f_Course.join(" ")}</td>
//       <td>{moment(item.createdAt).fromNow()}</td>
//       <td>
//         <span onClick={() => setIsEdit(item)} style={{ textDecoration: "underline", cursor: "pointer" }}>Edit</span> /
//         <span onClick={() => handleDelte(item._id)} style={{ textDecoration: "underline", cursor: "pointer" }}>Delete</span>
//       </td>
//     </tr>
//   ))}
// </tbody>

//     </table>
//     </>
      
//     }
//     {(openModal || isEdit) && 
//           <CreateEmployee setOpenModal={setOpenModal} isEdit={isEdit} setIsEdit={setIsEdit}/>
//         }
//     </div>
//   )
// }

// export default Employee



import { useContext, useState } from 'react';
import style from './employee.module.css';
import CreateEmployee from '../../component/createEmployee/CreateEmployee';
import { AuthContext } from '../../context/authContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from "moment";
import { useCustomMutation } from '../../customMutation';

function Employee() {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [filter, setFilter] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["employee", filter],
    queryFn: async () => {
      const endpoint = filter ? `/employee/search?query=${encodeURIComponent(filter)}` : "/employee";
      const response = await makeRequest.get(endpoint);
      return response.data;
    }
  });

  const mutationOptions = {
    onSuccess: () => {
      console.log('Mutation succeeded');
      queryClient.invalidateQueries(['employee']);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
    onSettled: () => {
      console.log('Mutation completed');
    },
    queryKey: ['employee'], 
  };

  const { mutate } = useCustomMutation(queryClient, mutationOptions);

  const handleDelete = async (id) => {
    mutate(makeRequest.delete(`/employee/${id}`));
  }

  const handleChange = (e) => {
    setFilter(e.target.value);
  }

  return (
    <div className={style.container}>
      {(!openModal && !isEdit) && (
        <>
          <h3>Employee List</h3>
          <div className={style.box}>
            <h4>Count : {data?.length}</h4>
            <span onClick={() => setOpenModal(true)}>Create Employee</span>
          </div>
          <div className={style.search}>
            <label>Search</label>
            <input type="text" value={filter} placeholder='Enter Search Keyword' onChange={handleChange} />
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Email Id</th>
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="10">Something went wrong!</td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan="10">Loading...</td>
                </tr>
              ) : data?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td><img src={`/upload/${item.f_Image}`} alt="" width={90} height={90} /></td>
                  <td>{item.f_Name}</td>
                  <td>{item.f_Email}</td>
                  <td>{item.f_Mobile}</td>
                  <td>{item.f_Designation}</td>
                  <td>{item.f_gender}</td>
                  <td>{item.f_Course.join(" ")}</td>
                  <td>{moment(item.createdAt).fromNow()}</td>
                  <td>
                    <span onClick={() => setIsEdit(item)} style={{ textDecoration: "underline", cursor: "pointer" }}>Edit</span> /
                    <span onClick={() => handleDelete(item._id)} style={{ textDecoration: "underline", cursor: "pointer" }}>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {(openModal || isEdit) && 
        <CreateEmployee setOpenModal={setOpenModal} isEdit={isEdit} setIsEdit={setIsEdit}/>
      }
    </div>
  );
}

export default Employee;

