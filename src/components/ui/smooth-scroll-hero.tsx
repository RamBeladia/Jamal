"use client";
import * as React from "react";
import {
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from "framer-motion";

interface iISmoothScrollHeroProps {
	scrollHeight: number;
	desktopImage: string;
	mobileImage: string;
	initialClipPercentage: number;
	finalClipPercentage: number;
}

interface iISmoothScrollHeroBackgroundProps extends iISmoothScrollHeroProps {}

const SmoothScrollHeroBackground: React.FC<iISmoothScrollHeroBackgroundProps> = ({
	scrollHeight,
	desktopImage,
	mobileImage,
	initialClipPercentage,
	finalClipPercentage,
}) => {
	const { scrollY } = useScroll();

	const clipStart = useTransform(scrollY, [0, scrollHeight], [initialClipPercentage, 0]);
	const clipEnd = useTransform(scrollY, [0, scrollHeight], [finalClipPercentage, 100]);

	const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;

	// Step-5 framing fix: land the zoom on 100% exactly when the clip finishes
	// opening (scrollHeight) instead of 500px later. The desktop logo is very wide
	// (2.33:1); leaving the zoom at ~117% when the window fully opens overflowed the
	// viewport and clipped the right-hand badge by ~66px at the climactic reveal. At
	// 100% the full wordmark + badge fit horizontally (letterboxed on black).
	const backgroundSize = useTransform(scrollY, [0, scrollHeight], ["170%", "100%"]);

	return (
		<motion.div
			className="sticky top-0 h-screen w-full bg-black"
			style={{ clipPath, willChange: "transform, opacity" }}
		>
			<motion.div
				className="absolute inset-0 md:hidden"
				style={{
					backgroundImage: `url(${mobileImage})`,
					backgroundSize,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			/>
			<motion.div
				className="absolute inset-0 hidden md:block"
				style={{
					backgroundImage: `url(${desktopImage})`,
					backgroundSize,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			/>
		</motion.div>
	);
};

const SmoothScrollHero: React.FC<iISmoothScrollHeroProps> = ({
	scrollHeight = 1500,
	desktopImage,
	mobileImage,
	initialClipPercentage = 25,
	finalClipPercentage = 75,
}) => {
	return (
		<div style={{ height: `calc(${scrollHeight}px + 100vh)` }} className="relative w-full">
			<SmoothScrollHeroBackground
				scrollHeight={scrollHeight}
				desktopImage={desktopImage}
				mobileImage={mobileImage}
				initialClipPercentage={initialClipPercentage}
				finalClipPercentage={finalClipPercentage}
			/>
		</div>
	);
};
export default SmoothScrollHero;