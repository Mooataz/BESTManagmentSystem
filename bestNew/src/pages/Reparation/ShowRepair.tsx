import React from 'react'
import { useParams } from 'react-router-dom';

export default function ShowRepair() {
  const { repairId } = useParams<{ repairId: string }>();
  console.log('{ repairId }', repairId)
  return (
    <div>
      ShowRepair 
    </div>
  )
}
