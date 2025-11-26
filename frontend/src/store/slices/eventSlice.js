import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    events: [],
    currentEvent: null,
    filters: {
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: ''
    },
    loading: false,
    error: null
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    updateEventSeats: (state, action) => {
      const { eventId, availableSeats } = action.payload;
      const event = state.events.find(e => e._id === eventId);
      if (event) {
        event.capacity.available = availableSeats;
      }
      if (state.currentEvent?._id === eventId) {
        state.currentEvent.capacity.available = availableSeats;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        city: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: ''
      };
    }
  }
});

export const { 
  setEvents, 
  setCurrentEvent, 
  updateEventSeats, 
  setFilters, 
  clearFilters 
} = eventSlice.actions;

export default eventSlice.reducer;
