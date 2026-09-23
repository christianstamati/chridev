/**
 * The brand marks the stack strip can show, by simple-icons slug. The Payload
 * `icon` select takes its options from this list, and the marquee maps each
 * one to its path, typed against the same list, so adding an option without a
 * mark is a type error. The paths stay out of this file to keep simple-icons
 * out of the Payload config.
 */
export const STACK_ICONS = [
  "typescript",
  "react",
  "nextdotjs",
  "tanstack",
  "tailwindcss",
  "shadcnui",
  "threedotjs",
  "webgpu",
  "unrealengine",
  "unity",
  "nodedotjs",
  "convex",
  "mongodb",
  "drizzle",
  "payloadcms",
  "betterauth",
  "blender",
  "figma",
] as const

export type StackIcon = (typeof STACK_ICONS)[number]
