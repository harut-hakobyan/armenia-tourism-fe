import type { DriverTripStatus } from '@/types/domain'

const transitions:Partial<Record<DriverTripStatus,{status:DriverTripStatus;label:string}>>={assigned:{status:'on_the_way',label:'Start driving to pickup'},on_the_way:{status:'arrived',label:'Mark arrived'},arrived:{status:'passenger_picked_up',label:'Passenger picked up'},passenger_picked_up:{status:'trip_started',label:'Start trip'},trip_started:{status:'completed',label:'Complete trip'}}
export function nextDriverAction(status:DriverTripStatus){return transitions[status]}
