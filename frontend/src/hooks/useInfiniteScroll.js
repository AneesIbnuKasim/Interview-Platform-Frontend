import { useEffect, useRef } from "react";

export default function useInfiniteScroll(callback, loading) {
  const observer = useRef();

  const lastElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (node) observer.current.observe(node);
  };

  return lastElementRef;
}