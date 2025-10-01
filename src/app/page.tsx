"use client";

import hero from "../../public/hero-page.png";
import developer from "../../public/developer_image.png";
import facebook from "../../public/Facebook.png";
import facebookLogo from "../../public/FacebookLogo.png";
import instagram from "../../public/Instagram.png";
import instagramLogo from "../../public/InstagramLogo.png";
import twitter from "../../public/Twitter.png";
import twitterLogo from "../../public/TwitterLogo.png";
import character from "../../public/character.png";

import Image from "next/image";
import {
    ArrowRight,
    User,
    Setting2,
    Share,
    Chart,
    Security,
    MagicStar,
    DocumentText,
    Global,
    MessageQuestion,
    Grid3,
    Menu,
    Card,
    Video,
    Facebook,
    Instagram,
    Link1,
} from "iconsax-reactjs";
import CollectionCard from "@/components/CollectionCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Collection {
    id: string;
    title: string;
    description: string;
    image: string;
    creator: string;
    creatorImage: string;
    linkCount: number;
    views: number;
}

export default function Home() {
    const [userEmail, setUserEmail] = useState("");
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(true);

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const staggerItem = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
    };

    // Refs for scroll-triggered animations
    const collectionsRef = useRef(null);
    const featuresRef = useRef(null);
    const howItWorksRef = useRef(null);
    const themesRef = useRef(null);
    const useCasesRef = useRef(null);
    const creatorRef = useRef(null);

    const collectionsInView = useInView(collectionsRef, {
        once: true,
        margin: "-100px",
    });
    const featuresInView = useInView(featuresRef, {
        once: true,
        margin: "-100px",
    });
    const howItWorksInView = useInView(howItWorksRef, {
        once: true,
        margin: "-100px",
    });
    const themesInView = useInView(themesRef, { once: true, margin: "-100px" });
    const useCasesInView = useInView(useCasesRef, {
        once: true,
        margin: "-100px",
    });
    const creatorInView = useInView(creatorRef, {
        once: true,
        margin: "-100px",
    });
    const router = useRouter();

    const { accessToken, refreshToken } = useAuthStore();

    // Fetch collections from API
    const fetchCollections = async () => {
        try {
            setIsLoadingCollections(true);
            const response = await api.get("/api/landingpage/collections");
            const data = await response.data;

            if (response.status === 200 && data.urls) {
                // Transform API response to match expected structure
                const transformedCollections = data.urls.map(
                    (url: any, index: number) => ({
                        id: url._id || String(index + 1),
                        title: url.title || `Collection ${index + 1}`,
                        description:
                            url.description ||
                            "A curated collection of useful links",
                        image: url.image || "",
                        creator: url.createdBy?.fullName || "Administrator",
                        creatorImage: url.createdBy?.userImage || "",
                        linkCount: url.storedLinkCount || 0,
                        views: url.views || 0,
                    })
                );

                setCollections(transformedCollections);
            } else {
                console.error("Failed to fetch collections:", data.message);
                // Fallback to empty array or show error
                setCollections([]);
            }
        } catch (error) {
            console.error("Error fetching collections:", error);
            setCollections([]);
        } finally {
            setIsLoadingCollections(false);
        }
    };

    useEffect(() => {
        const refreshUserToken = async () => {
            // setIsLoading(true);
            if (accessToken) {
                router.push("/home");
            } else {
                let res = await refreshToken();
                if (res === null) {
                    router.push("/");
                }
            }
            // setIsLoading(false);
        };
        refreshUserToken();
    }, [accessToken, refreshToken]);

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <div className="lg:min-h-screen h-auto ">
            {/* Hero Section */}
            <div className="flex items-center justify-center lg:h-screen h-fit lg:p-3 py-40 px-3 ">
                {/* lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem]  */}
                <div className="flex lg:flex-row flex-col  w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] items-center gap-15 ">
                    <motion.div
                        className="flex-1 flex flex-col gap-4  md:px-0"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.span
                            className="text-4xl font-bold font-display leading-tight text-center md:text-left"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Your One-Stop Link Storage Solution —{" "}
                            <span className="bg-[#F9ED32]">
                                Store, Share & Access Anywhere
                            </span>
                        </motion.span>
                        <motion.span
                            className="text-xl text-center md:text-left text-gray-600"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Simplify how you store, share, and access your links
                            — all in one powerful platform.
                        </motion.span>
                        <motion.div
                            className="w-full text-center md:text-left"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                                {/* Get Started Button */}
                                <button
                                    onClick={() => {
                                        router.push(
                                            `/signup${
                                                userEmail
                                                    ? `?email=${userEmail}`
                                                    : ""
                                            }`
                                        );
                                    }}
                                    className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-display font-semibold hover:from-primary/90 hover:to-blue-600/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <ArrowRight
                                            size="18"
                                            color="#FFFFFF"
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="flex-1 flex justify-center items-center md:w-[65%] sm:w-[90%] w-full ">
                        {/* Hero Image Recreation with Divs */}
                        <div className="relative w-full h-[500px] flex items-center justify-center">
                            {/* Main Card (Left, Foreground) - Smartphone-like vertical card */}
                            <motion.div
                                className="absolute md:left-15 left-8 top-1/2 transform -translate-y-1/2 w-58 h-90 rounded-3xl  z-10 "
                                initial={{
                                    opacity: 0,
                                    x: 200,
                                    y: 0,
                                    scale: 0.3,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 1.3,
                                    delay: 1.6,
                                    ease: "easeOut",
                                }}
                            >
                                <Image
                                    src={instagram}
                                    alt="instagram"
                                    className="w-full h-full scale-105 object-cover"
                                    draggable={false}
                                />
                                <Image
                                    src={instagramLogo}
                                    alt="instagram"
                                    className="absolute bottom-0 -left-14"
                                    draggable={false}
                                />
                            </motion.div>

                            {/* Central Overlay Card - Animates first with scale effect */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto py-[9px] px-[13px] bg-white rounded-full shadow-lg z-20 flex items-center justify-center gap-4"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: [1, 0.95, 1],
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                    scale: {
                                        times: [0, 0.5, 1],
                                        duration: 1.2,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#FEE9DE] flex items-center justify-center">
                                        <Image
                                            src={character}
                                            alt="character"
                                            className="w-[50%] h-[70%] object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col  justify-center gap-[1px]">
                                        <span className="text-sm font-bold text-gray-800 text-center sm:text-left min-w-[140px]">
                                            All Links, One Place
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            LinkLET
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <motion.div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        initial={{
                                            scale: 1,
                                            backgroundColor: "#6366f1",
                                        }}
                                        animate={{
                                            scale: [1, 0.5, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 1.0,
                                            ease: "easeInOut",
                                            delay: 1.2,
                                            times: [0, 0.3, 0.7, 1],
                                        }}
                                    >
                                        <span>
                                            <Link1 size="18" color="#FFFFFF" />
                                        </span>
                                    </motion.div>
                                </div>
                                {/* Mouse cursor */}
                                {/* <div className="absolute top-2 right-2 w-4 h-4 bg-gray-600 transform rotate-45"></div> */}
                            </motion.div>

                            {/* Twitter-like Card (Top Right) */}
                            <motion.div
                                className="absolute md:right-15 right-6 -top-3 w-48 h-64 bg-white rounded-xl  z-10"
                                initial={{
                                    opacity: 0,
                                    x: -100,
                                    y: 60,
                                    scale: 0.3,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 1.3,
                                    delay: 1.7,
                                    ease: "easeOut",
                                }}
                            >
                                <Image
                                    src={twitter}
                                    alt="twitter"
                                    className="w-full h-full  object-cover"
                                    draggable={false}
                                />
                                <Image
                                    src={twitterLogo}
                                    alt="twitter"
                                    className="absolute -top-5 -right-14"
                                    draggable={false}
                                />
                            </motion.div>

                            {/* Avocado Pattern Card (Bottom Right) */}
                            <motion.div
                                className="absolute md:right-15 right-6 -bottom-3 w-48 h-60  rounded-xl  z-10"
                                initial={{
                                    opacity: 0,
                                    x: -200,
                                    y: -150,
                                    scale: 0.3,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 1.3,
                                    delay: 1.8,
                                    ease: "easeOut",
                                }}
                            >
                                <Image
                                    src={facebook}
                                    alt="facebook"
                                    className="w-full h-full  object-cover"
                                    draggable={false}
                                />
                                <Image
                                    src={facebookLogo}
                                    alt="facebook"
                                    className="absolute top-10 -right-14"
                                    draggable={false}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sample Collections Section */}
            <div className="py-20 px-3 bg-gray-50" ref={collectionsRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            collectionsInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            See What Others Are Creating
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover amazing link collections created by our
                            community. Choose from various templates to make
                            your links stand out.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={collectionsInView ? "animate" : "initial"}
                    >
                        {isLoadingCollections ? (
                            <motion.div
                                className="col-span-full flex justify-center items-center py-8"
                                variants={staggerItem}
                            >
                                <div className="text-gray-500">
                                    Loading collections...
                                </div>
                            </motion.div>
                        ) : collections.length > 0 ? (
                            collections.map((collection, index) => (
                                <motion.div key={index} variants={staggerItem}>
                                    <CollectionCard
                                        id={collection.id}
                                        title={collection.title}
                                        description={collection.description}
                                        image={collection.image}
                                        creator={collection.creator}
                                        creatorImage={collection.creatorImage}
                                        linkCount={collection.linkCount}
                                        views={collection.views}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="col-span-full flex justify-center items-center py-8"
                                variants={staggerItem}
                            >
                                <div className="text-gray-500">
                                    No collections available at the moment.
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-3 bg-white" ref={featuresRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            featuresInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            Everything You Need to Organize Links
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make link management
                            simple, beautiful, and effective.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={featuresInView ? "animate" : "initial"}
                    >
                        <motion.div
                            className="text-center p-6"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MagicStar size="32" color="#6366f1" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-3">
                                Beautiful Templates
                            </h3>
                            <p className="text-gray-600">
                                Choose from multiple stunning templates to
                                showcase your links in the perfect style.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Share size="32" color="#6366f1" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-3">
                                Easy Sharing
                            </h3>
                            <p className="text-gray-600">
                                Share your link collections with a single URL.
                                Works on any device, anywhere.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Chart size="32" color="#6366f1" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-3">
                                View Analytics
                            </h3>
                            <p className="text-gray-600">
                                Track views to understand what resonates with
                                your audience.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Security size="32" color="#6366f1" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-3">
                                Secure & Reliable
                            </h3>
                            <p className="text-gray-600">
                                Your links are safe with enterprise-grade
                                security and 99.9% uptime guarantee.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center p-6"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Global size="32" color="#6366f1" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-3">
                                Public or Private
                            </h3>
                            <p className="text-gray-600">
                                Choose to make your collections public for
                                discovery or keep them private for personal use.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 px-3 bg-gray-50" ref={howItWorksRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            howItWorksInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get started in minutes with our simple 3-step
                            process.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={howItWorksInView ? "animate" : "initial"}
                    >
                        <motion.div
                            className="text-center"
                            variants={staggerItem}
                        >
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">
                                    1
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold font-display mb-4">
                                Create Your Collection
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Sign up and create your first link collection.
                                Add a title, description, and cover image.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            variants={staggerItem}
                        >
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">
                                    2
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold font-display mb-4">
                                Choose Your Template
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Select from our beautiful templates and
                                customize the look to match your style.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            variants={staggerItem}
                        >
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-white">
                                    3
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold font-display mb-4">
                                Share & Track
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Share your collection with a single link and
                                track engagement with detailed analytics.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Color Themes Showcase Section */}
            <div className="py-20 px-3 bg-white" ref={themesRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            themesInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            Choose Your Perfect Color Theme
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Beautiful color palettes designed to match your
                            style and create the perfect visual experience.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={themesInView ? "animate" : "initial"}
                    >
                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #0077BE, #2AAFEA)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Grid3 size="32" color="#FFFFFF" />
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                Ocean Breeze
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Cool blues and purples that evoke calmness and
                                professionalism. Perfect for portfolios and
                                business collections.
                            </p>
                            <div className="text-sm text-blue-600 font-medium">
                                Professional & Calm
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #38761D, #569B3B)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Menu size="32" color="#FFFFFF" />
                                    <div className="flex flex-col gap-1">
                                        <div className="w-16 h-1 bg-white/80 rounded"></div>
                                        <div className="w-12 h-1 bg-white/60 rounded"></div>
                                        <div className="w-14 h-1 bg-white/40 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                Forest Fresh
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Fresh greens and teals that bring energy and
                                growth. Ideal for creative projects and
                                nature-inspired collections.
                            </p>
                            <div className="text-sm text-green-600 font-medium">
                                Fresh & Energetic
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #FF6600, #FF8D33)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Card size="32" color="#FFFFFF" />
                                    <div className="flex gap-1">
                                        <div className="w-3 h-4 bg-white/80 rounded-sm"></div>
                                        <div className="w-3 h-4 bg-white/60 rounded-sm"></div>
                                        <div className="w-3 h-4 bg-white/40 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                Sunset Glow
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Warm pinks and reds that create passion and
                                creativity. Perfect for artistic portfolios and
                                personal collections.
                            </p>
                            <div className="text-sm text-pink-600 font-medium">
                                Warm & Creative
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #000000, #fe2c55, #25f4ee)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Video size="32" color="#FFFFFF" />
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                TikTok
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Bold black with vibrant accent colors that
                                capture the energy of social media. Perfect for
                                creators and influencers.
                            </p>
                            <div className="text-sm text-red-600 font-medium">
                                Bold & Dynamic
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #1877F2, #42A5F5, #90CAF9)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Facebook size="32" color="#FFFFFF" />
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                Facebook
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Clean and professional with Facebook's signature
                                blue. Ideal for business profiles and
                                professional networking.
                            </p>
                            <div className="text-sm text-blue-600 font-medium">
                                Professional & Clean
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
                            variants={staggerItem}
                        >
                            <div
                                className="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background:
                                        "linear-gradient(to bottom right, #833AB4, #C13584, #FCAF45)",
                                }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="relative z-10 flex flex-col items-center gap-2">
                                    <Instagram size="32" color="#FFFFFF" />
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-display mb-2">
                                Instagram
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Vibrant gradient colors that mirror Instagram's
                                iconic look. Perfect for visual creators and
                                lifestyle brands.
                            </p>
                            <div className="text-sm text-purple-600 font-medium">
                                Vibrant & Creative
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Use Cases Section */}
            <div className="py-20 px-3 bg-gray-50" ref={useCasesRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            useCasesInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            Perfect for Every Use Case
                        </h2>
                        <p className="text-xl text-gray-600">
                            Whether you're a creator, professional, or just want
                            to organize your links, Linklet adapts to your
                            needs.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={useCasesInView ? "animate" : "initial"}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                                <DocumentText size="32" color="#FFFFFF" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-4">
                                Content Creators
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Organize your resources, tools, and inspiration
                                in beautiful collections. Share your curated
                                links with your audience effortlessly.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-1">
                                <li>• Portfolio showcases</li>
                                <li>• Resource libraries</li>
                                <li>• Tool recommendations</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                                <Setting2 size="32" color="#FFFFFF" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-4">
                                Professionals
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Create professional link collections for
                                clients, projects, or team resources. Customize
                                branding to match your business.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-1">
                                <li>• Client presentations</li>
                                <li>• Project resources</li>
                                <li>• Team knowledge bases</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center mb-6">
                                <User size="32" color="#FFFFFF" />
                            </div>
                            <h3 className="text-xl font-bold font-display mb-4">
                                Personal Use
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Keep your personal bookmarks organized and
                                accessible. Share collections with friends and
                                family easily.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-1">
                                <li>• Personal bookmarks</li>
                                <li>• Travel resources</li>
                                <li>• Learning materials</li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            useCasesInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={
                                useCasesInView
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.95 }
                            }
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <h3 className="text-2xl font-bold font-display mb-4">
                                Ready to Get Started?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Start organizing your links with Linklet today.
                                Create your first collection in minutes and join
                                our growing community.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push("/signup")}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-display font-medium hover:bg-primary/90 transition-colors duration-200"
                                >
                                    Start Free Today
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Creator Section */}
            <div className="py-20 px-3 bg-white" ref={creatorRef}>
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            creatorInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold font-display mb-4">
                            Meet the Creator
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Built with passion by a developer who understands
                            the need for better link organization.
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            creatorInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <motion.div
                                className="flex"
                                initial={{ opacity: 0, x: -60 }}
                                animate={
                                    creatorInView
                                        ? { opacity: 1, x: 0 }
                                        : { opacity: 0, x: -60 }
                                }
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <div className="w-[250px] h-[300px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                                    {/* <span className="text-white font-bold text-4xl">
                                        D
                                    </span> */}
                                    <Image
                                        src={developer}
                                        alt="Developer"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex-1 text-center md:text-left"
                                initial={{ opacity: 0, x: 60 }}
                                animate={
                                    creatorInView
                                        ? { opacity: 1, x: 0 }
                                        : { opacity: 0, x: 60 }
                                }
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <h3 className="text-2xl font-bold font-display mb-4">
                                    Hi, I'm Millborne
                                </h3>
                                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                    I built Linklet because I was frustrated
                                    with scattered bookmarks and wanted a
                                    beautiful way to organize and share my
                                    links. As a developer, I understand the
                                    importance of clean, efficient tools that
                                    just work.
                                </p>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    Linklet combines my passion for clean design
                                    with practical functionality, giving you a
                                    platform that's both beautiful and powerful.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <a
                                        href="https://millborneportfolio.vercel.app/"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-display font-medium hover:bg-primary/90 transition-colors duration-200"
                                    >
                                        <span>View My Portfolio</span>
                                        <ArrowRight size="18" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/millborne-galamiton/"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg font-display font-medium hover:bg-primary/5 transition-colors duration-200"
                                    >
                                        <span>Connect on LinkedIn</span>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="pt-12 px-3 bg-gray-900 text-white ">
                <div className="w-full lg:max-w-[60rem] lg:px-0 xl:max-w-[76rem] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8  ">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold font-display mb-4">
                                Linklet
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Your one-stop solution for organizing, sharing,
                                and discovering amazing link collections.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold font-display mb-4">
                                Product
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Templates
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Analytics
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold font-display mb-4">
                                Support
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Linklet. All rights reserved.</p>
                    </div> */}

                    <div
                        className={`flex items-center justify-center border-t border-gray-800 mt-8 pt-8 w-full py-5 px-3 md:px-0 static`}
                    >
                        <span className="font-display text-sm text-white text-center">
                            © {new Date().getFullYear()} LinkLET |{" "}
                            <a
                                href="https://millborneportfolio.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary"
                            >
                                Millborne Galamiton.
                            </a>{" "}
                            All rights reserved.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
