import { describe, expect, it } from 'vitest'
import { nextDriverAction } from './workflow'

describe('driver workflow',()=>{
  it('exposes only the next allowed operational action',()=>{
    expect(nextDriverAction('assigned')?.status).toBe('on_the_way')
    expect(nextDriverAction('arrived')?.status).toBe('passenger_picked_up')
    expect(nextDriverAction('trip_started')?.status).toBe('completed')
  })
  it('has no action after completion',()=>expect(nextDriverAction('completed')).toBeUndefined())
})
