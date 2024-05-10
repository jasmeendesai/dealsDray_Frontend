import { useState } from "react";
import style from "./createEmployee.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "../../customMutation";
import { makeRequest } from "../../axios";

// Create and Update Employee Data

function CreateEmployee({ setOpenModal, isEdit, setIsEdit }) {
    const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState({
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "",
    f_gender: "",
    f_Course: []
  });

  console.log(isEdit)

  const mutationOptions = {
    onSuccess: () => {
      console.log('Mutation succeeded');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
    onSettled: (data, error, variables) => {
      console.log('Mutation completed');
    },
    queryKey: ['employee'], 
  };


const { mutate } = useCustomMutation(queryClient, mutationOptions);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };


const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
        setInputs(prev => ({...prev, f_Course: checked  ? [...prev.f_Course, value]  : prev.f_Course.filter(course => course !== value)
        }));
    } else {
        setInputs(prev => ({...prev, [name]: value
        }));
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    let img = await upload(file);
    console.log(inputs, img)
    if (isEdit) {
      await mutate(makeRequest.put.bind(null, `/employee/${isEdit._id}`), { ...inputs,  f_Image: img});
      setIsEdit(false);
    } else{
      mutate(makeRequest.post.bind(null, '/employee'), {...inputs, f_Image : img});
      setOpenModal(false);
    }
    
  };

  const handleClose = (e) => {
    e.preventDefault();
    if (isEdit) setIsEdit(false);
    setOpenModal(false);
  };

  return (
    <div className={style.container}>
      <CloseIcon onClick={handleClose} fontSize="large" className={style.icon} />
      <form>
        <div className={style.item}>
          <label>Name</label>
          <input type="text" name="f_Name" value={inputs.f_Name} onChange={handleChange} />
        </div>
        <div className={style.item}>
          <label>Email</label>
          <input type="email" name="f_Email" value={inputs.f_Email} onChange={handleChange}/>
        </div>
        <div className={style.item}>
          <label>Mobile No</label>
          <input type="Number" name="f_Mobile" value={inputs.f_Mobile} onChange={handleChange} />
        </div>
        <div className={style.item}>
          <label>Designation</label>
          <div>
            <select name="f_Designation" value={inputs.f_Designation} onChange={handleChange}>
            <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>
        <div className={style.item}>
          <label>Gender</label>
          <div>
          <input type="radio" name="f_gender" value="Male" checked={inputs.f_gender === 'Male'} onChange={handleChange} /> 
          <span> Male</span>
          <br />
          <input type="radio" name="f_gender" value="Female" checked={inputs.f_gender === 'Female'} onChange={handleChange}/>
          <span> Female</span>
          </div>
        </div>
        <div className={style.item}>
          <label>Course</label>
          <div>
          <input type="checkbox" name="f_Course" value="MCA" checked={inputs.f_Course.includes("MCA")} onChange={handleChange} />
          <span> MCA</span>
          <br />
          <input type="checkbox" name="f_Course" value="BCA" checked={inputs.f_Course.includes("BCA")} onChange={handleChange} />
          <span> BCA</span>
          <br />
          <input type="checkbox" name="f_Course" value="BSC" checked={inputs.f_Course.includes("BSC")} onChange={handleChange} />
          <span> BSC</span>
          </div>
        </div>
        <div className={style.item}>
          <label htmlFor="file">
            <span>Img Upload</span>
          </label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button onClick={handleSubmit} className={style.button}>
          {isEdit ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateEmployee;
