import React, { useEffect, useState, useCallback } from "react";

export const color = {
  red: "#e57373"
};

export class MomentUtil {
  static hmsFormat(time) {
    var format_str = [];
    if (time.hours() > 0) format_str.push("h[h]");
    if (time.minutes() > 0) format_str.push("m[m]");
    if (time.seconds() > 0) format_str.push("s[s]");
    return time.format(format_str.join(" "));
  }
}

export const wrapX = (x, x_min, x_max) =>
  ((((x - x_min) % (x_max - x_min)) + (x_max - x_min)) % (x_max - x_min)) +
  x_min;

export class Meal {
  constructor(db_info) {
    this.info = db_info;
    ["name", "time", "image"].forEach(key => {
      Object.defineProperty(this, key, {
        get: () => this.info[key],
        set: v => {
          // store in databse
          this.info[key] = v;
        }
      });
    });
  }
  get id() {
    return this.info.id;
  }
  filterTags(tags) {
    return (
      tags.length === 0 ||
      tags.some(
        tag => tag.key === "name" && this.name.toLowerCase().includes(tag.value)
      )
    );
  }
}

export const recursiveMap = (children, fn, exclude) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (
      child.props.children &&
      (!exclude ||
        !child.props.className ||
        !child.props.className.includes(exclude))
    ) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn)
      });
    }

    return fn(child);
  });
};

export const bytesToSize = bytes => {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

export const useWindowSize = () => {
  const isClient = typeof window === "object";

  const getSize = useCallback(() => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }, [isClient]);

  const [windowSize, setWindowSize] = useState(getSize);
  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getSize, isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};
