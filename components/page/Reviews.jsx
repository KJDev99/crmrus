import React from 'react'
import ReviewItem from '../ui/ReviewItem'

export default function Reviews() {
  return (
    <div>
        <ReviewItem status="positive" />
      <ReviewItem status="constructive" />
      <ReviewItem status="positive" />
    </div>
  )
}
