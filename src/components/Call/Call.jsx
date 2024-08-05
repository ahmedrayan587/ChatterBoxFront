import React from 'react'
import './Call.css'

export default function Call({children, media, callStarted}) {
  return (
    <div className={(media.audio&&callStarted)?'call-container':'d-none'}>{children}</div>
  )
}
