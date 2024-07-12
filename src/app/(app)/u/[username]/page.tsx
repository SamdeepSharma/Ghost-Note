'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const Message = () => {
     const params = useParams()
     return (
          <div>
               Anonymously message {params.username}
          </div>
     )
}

export default Message