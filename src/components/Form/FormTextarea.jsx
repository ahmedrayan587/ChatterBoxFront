import React from 'react'

export default function FormTextarea({name,rows,minLength,maxLength,setValues}) {
  return (
    <div className="inputBox">
      <label className='validation-text'></label>
      <textarea rows={rows} required="required" minLength={minLength} maxLength={maxLength} onKeyUp={(event)=>{
            setValues(event.target.value);
            if(event.target.value.length > 0){
              event.target.classList.add('typed'); 
            }else{
              event.target.classList.remove('typed');
            }
            if(event.target.value.length < minLength){
                event.target.previousElementSibling.textContent = `يجب ان لا يقل عن ${minLength} حرف.`;
                event.target.previousElementSibling.style.color = "crimson";        
            }else if(event.target.value.length > maxLength){
                event.target.previousElementSibling.textContent = `يجب ان لا يزيد عن ${maxLength} حرف.`;
                event.target.previousElementSibling.style.color = "crimson";
            }else{
              
                event.target.previousElementSibling.textContent = "مطابق للمواصفات";
                event.target.previousElementSibling.style.color = "forestgreen";
            }
        }} ></textarea>
      <span className="user">{name}</span>
    </div>
  )
}
