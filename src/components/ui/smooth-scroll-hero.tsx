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

function useIsMobile() {
	const [mobile, setMobile] = React.useState(false);
	React.useEffect(() => {
		const mq = window.matchMedia("(max-width: 767px)");
		const check = () => setMobile(mq.matches);
		check();
		mq.addEventListener("change", check);
		return () => mq.removeEventListener("change", check);
	}, []);
	return mobile;
}

// Desktop: original scroll-driven clip-path + zoom reveal
const SmoothScrollHeroBackground: React.FC<iISmoothScrollHeroProps> = ({
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
	const isMobile = useIsMobile();

	// On mobile the Hero section becomes the full-screen hero (with dim logo bg).
	// This component only renders its scroll-driven reveal on desktop.
	if (isMobile) return null;

	return (
		<div
			style={{ height: `calc(${scrollHeight}px + 100vh)` }}
			className="relative w-full"
		>
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
