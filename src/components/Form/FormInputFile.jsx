import React, { useState } from 'react'

export default function FormInputFile({name,setValues,type}) {
    const [fileName, setFileName] = useState("");
  return (
    <div className="fileUploadWrapper">
    <label htmlFor={name}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 500">
    <circle
        strokeWidth="30"
        stroke="#6c6c6c"
        fill="none"
        r="230"
        cy="250"
        cx="250"
    ></circle>
    <path
        strokeLinecap="round"
        strokeWidth="35"
        stroke="#6c6c6c"
        d="M249.759 130V370"
    ></path>
    <path
        strokeLinecap="round"
        strokeWidth="35"
        stroke="#6c6c6c"
        d="M130 249.138H370"
    ></path>
</svg>

      <span className="user">{fileName==""?name:fileName}</span>
    </label>
    {type=='image'?<input type="file" id={name} name={name} accept='image/*' onChange={(e)=>{
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
            setValues(reader.result);
            };
            if (file) {
            reader.readAsDataURL(file);
            }
            setFileName(e.target.files[0].name)
        }} />:type=='video'?
        <input type="file" id={name} name={name} accept='video/*' onChange={(e)=>{
            setValues(e.target.files[0]);
            setFileName(e.target.files[0].name)
        }} />:
        <input type="file" id={name} name={name} onChange={(e)=>{
            setValues(e.target.files[0]);
            setFileName(e.target.files[0].name)
        }} />
    }
  </div>
  )
}
