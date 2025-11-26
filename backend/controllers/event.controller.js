import Event from '../models/Event.model.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { category, city, page = 1, limit = 10, sort = '-date.start' } = req.query;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (city) query['venue.city'] = new RegExp(city, 'i');

    const events = await Event.find(query)
      .populate('organizer', 'name email avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
export const createEvent = async (req, res) => {
  try {
    req.body.organizer = req.user.id;
    const event = await Event.create(req.body);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Emit socket event for real-time update
    req.app.get('io').emit('event:updated', event);

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
export const searchEvents = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, startDate, endDate } = req.query;

    let query = { status: 'published' };

    if (q) {
      query.$text = { $search: q };
    }

    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
    }

    if (startDate || endDate) {
      query['date.start'] = {};
      if (startDate) query['date.start'].$gte = new Date(startDate);
      if (endDate) query['date.start'].$lte = new Date(endDate);
    }

    const events = await Event.find(query).populate('organizer', 'name email');

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
