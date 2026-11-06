import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function usePopupAnimation(isOpen = true) {
  const popupRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen || !popupRef.current) return;
    const popSound = new Audio("/audio/pop.mp3");
    popSound.volume = 0.1;
    popSound.play().catch(() => {});

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(popupRef.current, {
        opacity: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        rotation: -8,
        transformOrigin: "50% 50%",
      });

      tl.to(popupRef.current, {
        opacity: 1,
        scaleX: 1.25,
        scaleY: 0.75,
        rotation: 5,
        duration: 0.3,
        ease: "power3.out",
      })
        .to(popupRef.current, {
          scaleX: 0.8,
          scaleY: 1.2,
          rotation: -4,
          duration: 0.18,
          ease: "power2.inOut",
        })
        .to(popupRef.current, {
          scaleX: 1.15,
          scaleY: 0.85,
          rotation: 3,
          duration: 0.16,
          ease: "power2.inOut",
        })
        .to(popupRef.current, {
          scaleX: 0.95,
          scaleY: 1.05,
          rotation: -1.5,
          duration: 0.14,
          ease: "power2.inOut",
        })
        .to(popupRef.current, {
          scaleX: 1.02,
          scaleY: 0.98,
          rotation: 0.5,
          duration: 0.12,
          ease: "power2.inOut",
        })
        .to(popupRef.current, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.2,
          ease: "elastic.out(1.2, 0.4)",
          clearProps: "transform",
        });
    }, popupRef);

    return () => ctx.revert();
  }, [isOpen]);

  return popupRef;
}
