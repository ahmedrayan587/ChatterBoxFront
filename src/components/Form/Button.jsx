import React from 'react'
import { Link } from 'react-router-dom'

export default function Button({name,path}) {
  return (
    <>
      <Link to={path} className="button" >{name}</Link>
    </>
  )
}