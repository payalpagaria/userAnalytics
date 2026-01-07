import Event from "../model/eventSchema.js";


export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getSessionsWithEventCounts = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          eventCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          eventCount: 1
        }
      },
      {
        $sort: { eventCount: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getEventsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ session_id: sessionId })
      .sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getClickHeatmapForPage = async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({
        success: false,
        message: "page_url query param is required"
      });
    }

    const heatmap = await Event.aggregate([
      {
        $match: {
          event_type: "click",
          page_url
        }
      },
      {
        $group: {
          _id: {
            x: { $floor: "$click_coordinates.x" },
            y: { $floor: "$click_coordinates.y" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          x: "$_id.x",
          y: "$_id.y",
          count: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: heatmap
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
