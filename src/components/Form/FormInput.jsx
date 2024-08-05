import React from 'react'

export default function FormInput({name,type,minLength="",maxLength="",min="",max="",setValues}) {
  return (
    <div className="inputBox">
      <label className='validation-text'></label>
      <input type={type} min={min} max={max} required="required" minLength={minLength} maxLength={maxLength} onKeyUp={(event)=>{
            setValues(event.target.value);
            if(event.target.value.length > 0){
              event.target.classList.add('typed'); 
            }else{
              event.target.classList.remove('typed');
            }
            if(!event.target.checkValidity()){
                event.target.previousElementSibling.textContent = `Length should be between ${minLength} and ${maxLength}`;
                event.target.previousElementSibling.style.color = "crimson";        
            }else{
                event.target.previousElementSibling.textContent = "Good";
                event.target.previousElementSibling.style.color = "forestgreen";
            }
        }}   />
      <span className="user">{name}</span>
    </div>
  )
}
