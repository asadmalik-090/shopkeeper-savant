
import React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

/**
 * AspectRatio component to maintain consistent width-to-height ratio
 * 
 * @param {Object} props - Component props passed to Radix UI AspectRatio
 * @returns {JSX.Element} AspectRatio component
 * 
 * @example
 * <AspectRatio ratio={16/9}>
 *   <img src="image.jpg" alt="Image with 16:9 aspect ratio" />
 * </AspectRatio>
 */
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
