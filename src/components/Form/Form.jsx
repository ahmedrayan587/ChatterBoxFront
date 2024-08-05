import React, { useState } from 'react'
import "./Form.css"

export default function Form({name,submitFunction,children}) {
  const [validationText,setValidationText] = useState("");
  return (
    <div key={name} className="container">
      <form className="card" onSubmit={submitFunction}>
      {children}
      </form>
    </div>
  )
}
