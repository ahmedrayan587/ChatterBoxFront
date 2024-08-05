import React, { useState } from 'react'
import axios from 'axios';
import Form from '../components/Form/Form'
import FormTitle from '../components/Form/FormTitle'
import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Button from '../components/Form/Button'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormInputFile from '../components/Form/FormInputFile';
import Cookies from 'js-cookie';
import { loginRoute, registerRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';



export default function SignUp() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function login() {
  
    try {
      const response = await axios.post(loginRoute, {
        username: username,
        password: password,
      });
      if (response.data.status == 200) {
        console.log('Piece data posted successfully:',response);
        Cookies.set('username', response.data.user.username);
        Cookies.set('userID', response.data.user._id);
        navigate('/home');
      } else {
        console.error('Error posting piece data:',response);
      }
    } catch (error) {
      console.error('Error during post request:', error);
    }
  };

async function fetchData() {
    toast.loading("The process may take few seconds",{
      position:'top-right',
      autoClose:false,
      hideProgressBar:false,
      newestOnTop:false,
      closeOnClick:true,
      rtl:true,
      draggable:true,
      pauseOnHover:true,
      progress: undefined,
      theme:'light',
    });
  try {
    const response = await axios.post(registerRoute, {
      image:image,
      username: username,
      email: email,
      password: password,
    });
    if (response.data.status === 200) {
      console.log('Piece data posted successfully:', response);
      toast.dismiss();
      toast.success("SignUp Success",{
        position:'top-right',
        autoClose:5000,
        hideProgressBar:false,
        newestOnTop:false,
        closeOnClick:true,
        rtl:true,
        draggable:true,
        pauseOnHover:true,
        progress: undefined,
        theme:'light',
      });
      login();
    } else {
      console.error('Error posting piece data:', response);
      toast.dismiss();
      toast.error(response.data.msg);
    }
  } catch (error) {
    console.error('Error during post request:', error);
    toast.dismiss();
    toast.error("Problem during the signup process");
  }
};
function submit(event){
  event.preventDefault();
  fetchData();   
}
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <Form key={"register"} submitFunction={submit} >
        <FormTitle key={"title"} name="SignUp"/>
        <FormInputFile key={"image"} name={"Add Your Image"} setValues={setImage} type={"image"} />
        <FormInput key={"username"} name="Username" type="text" minLength={3} maxLength={20} setValues={setUsername}/>
        <FormInput key={"email"} name="Email" type="email" minLength={3} maxLength={50} setValues={setEmail}/>
        <FormInput key={"password"} name="Password" type="password" minLength={8} maxLength={50} setValues={setPassword}/>
        <FormButton key={"submit"} name="Submit"/> 
      </Form>
      <Button name={"Login"} path={"/login"} />
    </div>
  )
}
