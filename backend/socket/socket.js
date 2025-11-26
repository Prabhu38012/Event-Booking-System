export const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ New client connected:', socket.id);

    // Join event room
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
      console.log(`User ${socket.id} joined event ${eventId}`);
    });

    // Leave event room
    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
      console.log(`User ${socket.id} left event ${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};

// Utility functions to emit events
export const emitSeatUpdate = (io, eventId, availableSeats) => {
  io.to(`event:${eventId}`).emit('seats:updated', { eventId, availableSeats });
};

export const emitBookingCreated = (io, eventId, booking) => {
  io.to(`event:${eventId}`).emit('booking:created', booking);
};
