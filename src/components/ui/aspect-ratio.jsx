
/**
 * @fileoverview AspectRatio component to maintain consistent width-to-height ratios
 * This component wraps content and maintains a specified aspect ratio regardless of width.
 */

import React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatio component maintains content at a specific aspect ratio
 * Uses Radix UI's AspectRatio component under the hood
 * 
 * @param {Object} props - Component props
 * @param {number} [props.ratio] - The aspect ratio to maintain (width/height)
 * @param {React.ReactNode} props.children - The content to display
 * @param {React.HTMLAttributes<HTMLDivElement>} props.rest - Other div attributes
 * @returns {JSX.Element} AspectRatio component
 * 
 * @example
 * // 16:9 aspect ratio container with an image
 * <AspectRatio ratio={16/9}>
 *   <img src="/image.jpg" alt="Example" className="object-cover w-full h-full" />
 * </AspectRatio>
 * 
 * @example
 * // 1:1 aspect ratio (square)
 * <AspectRatio ratio={1}>
 *   <div className="flex items-center justify-center bg-muted">Square content</div>
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
