import {z} from "zod"

export const eventSchema=z.object({
    session_id: z.string(),
    event_type: z.enum(["page_view", "click"]),
    page_url: z.string(),
    timestamp: z.coerce.date().optional(),
    click_coordinates: z
      .object({
        x: z.number(),
        y: z.number()
      })
      .optional()
}).strict();