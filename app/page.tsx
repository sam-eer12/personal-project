"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CarScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const valueAddRef = useRef<HTMLDivElement>(null);
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);
  const box3Ref = useRef<HTMLDivElement>(null);
  const box4Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Return early if elements are not firmly in DOM
      if (!carRef.current || !trailRef.current || !valueAddRef.current || !sectionRef.current || !trackRef.current) return;

      const car = carRef.current;
      const trail = trailRef.current;
      const valueAdd = valueAddRef.current;
      const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

      const valueRect = valueAdd.getBoundingClientRect();
      const letterOffsets = letters.map((letter) => letter.offsetLeft);

      // Constants from original html
      const roadWidth = window.innerWidth;
      const carWidth = 150; // Approximated car width matching the hardcoded GSAP logic
      const endX = roadWidth - carWidth;

      gsap.to(car, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: trackRef.current,
        },
        x: endX,
        ease: "none",
        onUpdate: function () {
          const carX = (gsap.getProperty(car, "x") as number) + carWidth / 2;
          letters.forEach((letter, i) => {
            const letterX = valueRect.left + letterOffsets[i];
            if (carX >= letterX) {
              letter.style.opacity = "1";
            } else {
              letter.style.opacity = "0";
            }
          });
          gsap.set(trail, { width: carX });
        },
      });

      // Animate Info Boxes
      const boxes = [
        { ref: box1Ref.current, start: "top+=400" },
        { ref: box2Ref.current, start: "top+=600" },
        { ref: box3Ref.current, start: "top+=800" },
        { ref: box4Ref.current, start: "top+=1000" },
      ];

      boxes.forEach((box, index) => {
        if (!box.ref) return;
        gsap.to(box.ref, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${box.start} top`,
            end: `+=${200} top`,
            scrub: true,
          },
          opacity: 1,
        });
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  const welcomeText = "WELCOME ITZFIZZ".split("");

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShaderAnimation />
      </div>

      <div className="section z-10" ref={sectionRef}>
        <div className="track" ref={trackRef}>
          <div className="road" id="road">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://paraschaturvedi.github.io/car-scroll-animation/McLaren%20720S%202022%20top%20view.png"
              alt="car"
              className="car"
              ref={carRef}
            />
            <div className="trail" ref={trailRef} />
            <div className="value-add" ref={valueAddRef} style={{ top: "30%" }}>
              {welcomeText.map((char, index) => (
                <span
                  key={index}
                  className="value-letter"
                  ref={(el) => {
                    if (el) lettersRef.current[index] = el;
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
          <div className="text-box" ref={box1Ref} id="box1" style={{ top: "5%", right: "30%" }}>
            <span className="num-box">58%</span> Increase in pick up point use
          </div>
          <div className="text-box" ref={box2Ref} id="box2" style={{ bottom: "5%", right: "35%" }}>
            <span className="num-box">23%</span> Decreased in customer phone calls
          </div>
          <div className="text-box" ref={box3Ref} id="box3" style={{ top: "5%", right: "10%" }}>
            <span className="num-box">27%</span> Increase in pick up point use
          </div>
          <div className="text-box" ref={box4Ref} id="box4" style={{ bottom: "5%", right: "12.5%" }}>
            <span className="num-box">40%</span> Decreased in customer phone calls
          </div>
        </div>
      </div>
    </div>
  );
}
