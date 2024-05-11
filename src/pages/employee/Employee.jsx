
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
    await mutate(makeRequest.put.bind(null, `/employee`), {employeeId : id});

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

