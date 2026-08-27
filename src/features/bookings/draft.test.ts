import { beforeEach, describe, expect, it } from 'vitest'
import { bookingDraft } from './draft'

describe('bookingDraft', () => {
  beforeEach(() => sessionStorage.clear())

  it('preserves a custom route between estimation and booking', () => {
    bookingDraft.set({
      service_type: 'custom_trip',
      car_id: 2,
      route_points: [
        { latitude: 40.18, longitude: 44.51, label: 'Yerevan' },
        { latitude: 40.11, longitude: 44.73, label: 'Garni' },
      ],
      service_options: { return_to_yerevan: true },
    })

    expect(bookingDraft.get()).toMatchObject({ service_type: 'custom_trip', car_id: 2 })
    expect(bookingDraft.get()?.route_points).toHaveLength(2)
  })

  it('clears the draft after a successful booking', () => {
    bookingDraft.set({ service_type: 'tour', tour_id: 1 })
    bookingDraft.clear()
    expect(bookingDraft.get()).toBeNull()
  })
})
