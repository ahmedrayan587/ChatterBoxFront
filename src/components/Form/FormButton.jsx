import React from 'react'

export default function FormButton({name}) {
  return (
    <>
      <button className="button" type='submit'>{name}</button>
    </>
  )
}
