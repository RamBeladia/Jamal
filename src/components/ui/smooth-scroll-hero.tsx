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

// Mobile: auto-plays the reveal on mount — no scroll required
const MobileHeroBackground: React.FC<Pick<iISmoothScrollHeroProps, "mobileImage" | "initialClipPercentage" | "finalClipPercentage">> = ({
	mobileImage,
	initialClipPercentage,
	finalClipPercentage,
}) => {
	const ease = [0.2, 0.7, 0.2, 1] as const;
	const duration = 1.4;

	const initialClip = `polygon(${initialClipPercentage}% ${initialClipPercentage}%, ${finalClipPercentage}% ${initialClipPercentage}%, ${finalClipPercentage}% ${finalClipPercentage}%, ${initialClipPercentage}% ${finalClipPercentage}%)`;
	const finalClip = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;

	return (
		<motion.div
			className="relative h-screen w-full bg-black overflow-hidden"
			initial={{ clipPath: initialClip }}
			animate={{ clipPath: finalClip }}
			transition={{ duration, ease }}
		>
			<motion.div
				className="absolute inset-0"
				initial={{ backgroundSize: "170%" }}
				animate={{ backgroundSize: "100%" }}
				transition={{ duration, ease }}
				style={{
					backgroundImage: `url(${mobileImage})`,
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			/>
		</motion.div>
	);
};

// Desktop: original scroll-driven reveal
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

	return (
		<div
			style={{ height: isMobile ? "100vh" : `calc(${scrollHeight}px + 100vh)` }}
			className="relative w-full"
		>
			{isMobile ? (
				<MobileHeroBackground
					mobileImage={mobileImage}
					initialClipPercentage={initialClipPercentage}
					finalClipPercentage={finalClipPercentage}
				/>
			) : (
				<SmoothScrollHeroBackground
					scrollHeight={scrollHeight}
					desktopImage={desktopImage}
					mobileImage={mobileImage}
					initialClipPercentage={initialClipPercentage}
					finalClipPercentage={finalClipPercentage}
				/>
			)}
		</div>
	);
};

export default SmoothScrollHero;
