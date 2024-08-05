import React from 'react'

export default function Message({fromSelf,message,date,time}) {
  return (
    <div className={`message ${fromSelf?'my-message':'frnd-message'}`}>
      <p>{message}
        <br/>
        <span>
          {time}
        </span>
      </p>
      </div>
  )
}
