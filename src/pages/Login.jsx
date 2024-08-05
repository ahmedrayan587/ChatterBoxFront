import React, { useState } from 'react'
import axios from 'axios';
import Form from '../components/Form/Form'
import FormTitle from '../components/Form/FormTitle'
import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Button from '../components/Form/Button'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { loginRoute } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");


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
    const response = await axios.post(loginRoute, {
      username: username,
      password: password,
    });
    if (response.data.status == 200) {
      toast.dismiss();
      toast.success("Login Success",{
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
      console.log('Piece data posted successfully:',response);
      Cookies.set('username', response.data.user.username);
      Cookies.set('userID', response.data.user._id);
      navigate('/home');
    } else {
      toast.dismiss();
      toast.error(response.data.msg);
      console.error('Error posting piece data:',response);
    }
  } catch (error) {
    toast.dismiss();
    toast.error("Incorrect username or password");
    console.error('Error during post request:', error);
  }
};
  function submit(event){
    event.preventDefault();
    fetchData();
  }
  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <Form key={"login"} submitFunction={submit} >
        <FormTitle key={"title"} name="Login"/>
        <FormInput key={"username"} name="Username" type="text" minLength={3} maxLength={20} setValues={setUsername}/>
        <FormInput key={"password"} name="Password" type="password" minLength={8} maxLength={50} setValues={setPassword}/>
        <FormButton key={"submit"} name="Submit"/> 
      </Form>
      <Button name={"SignUp"} path={"/"} />
    </div>
  )
}
