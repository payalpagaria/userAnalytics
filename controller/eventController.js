
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
          eventCount: { $sum: 1 },
          start_time: { $min: "$timestamp" },
          end_time: { $max: "$timestamp" },
          firstEvent: { $first: "$$ROOT" },
          lastEvent: { $last: "$$ROOT" }
        }
      },
      {
        $addFields: {
          duration: {
            $divide: [
              { $subtract: ["$end_time", "$start_time"] },
              1000 
            ]
          },
          
          status: {
            $cond: {
              if: {
                $gt: [
                  { $subtract: [new Date(), "$end_time"] },
                  1800000 
                ]
              },
              then: "Ended",
              else: "Active"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          eventCount: 1,
          start_time: 1,
          end_time: 1,
          duration: 1,
          status: 1,
          views: {
            $cond: {
              if: { $eq: ["$firstEvent.event_type", "page_view"] },
              then: "$eventCount",
              else: 0
            }
          },
          clicks: {
            $cond: {
              if: { $eq: ["$firstEvent.event_type", "click"] },
              then: "$eventCount",
              else: 0
            }
          }
        }
      },
      {
        $sort: { end_time: -1 } 
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

export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({ session_id: sessionId })
      .sort({ timestamp: 1 });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    const startTime = events[0].timestamp;
    const endTime = events[events.length - 1].timestamp;
    const duration = (endTime - startTime) / 1000; // seconds

    const pageViews = events.filter(e => e.event_type === "page_view").length;
    const clicks = events.filter(e => e.event_type === "click").length;

    const isActive = (new Date() - endTime) < 1800000;

    return res.status(200).json({
      success: true,
      data: {
        session_id: sessionId,
        start_time: startTime,
        end_time: endTime,
        duration: duration,
        status: isActive ? "Active" : "Ended",
        total_events: events.length,
        page_views: pageViews,
        clicks: clicks,
        events: events
      }
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

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $facet: {
          totalEvents: [
            { $count: "count" }
          ],
          totalSessions: [
            { $group: { _id: "$session_id" } },
            { $count: "count" }
          ],
          activeSessions: [
            {
              $group: {
                _id: "$session_id",
                lastEvent: { $max: "$timestamp" }
              }
            },
            {
              $match: {
                lastEvent: {
                  $gte: new Date(Date.now() - 1800000) // 30 minutes
                }
              }
            },
            { $count: "count" }
          ],
          avgEventsPerSession: [
            {
              $group: {
                _id: "$session_id",
                eventCount: { $sum: 1 }
              }
            },
            {
              $group: {
                _id: null,
                avgEvents: { $avg: "$eventCount" }
              }
            }
          ]
        }
      }
    ]);

    const result = {
      total_sessions: stats[0].totalSessions[0]?.count || 0,
      total_events: stats[0].totalEvents[0]?.count || 0,
      active_sessions: stats[0].activeSessions[0]?.count || 0,
      avg_events_per_session: Math.round(stats[0].avgEventsPerSession[0]?.avgEvents || 0)
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};