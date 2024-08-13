import { useEffect, useState } from "react";
import { MinusIcon, SquareIcon } from "lucide-react";
import {
  WindowIsMaximised,
  WindowMinimise,
  WindowToggleMaximise,
  Quit,
} from "@wailsjs/runtime";
import appIcon from "@/assets/images/icon.png";
import maximizeIconLight from "@/assets/icons/maximize-light.png";
import maximizeIconDark from "@/assets/icons/maximize-dark.png";

export default function AppBar() {
  const [isMaximised, setIsMaximised] = useState<boolean>();

  useEffect(() => {
    const updateMaximised = () => {
      WindowIsMaximised().then(setIsMaximised);
    };

    // get the window state on load
    updateMaximised();

    window.addEventListener("resize", updateMaximised);
    return () => {
      window.removeEventListener("resize", updateMaximised);
    };
  }, []);

  const handleAction = (action: "TOGGLE_MAXIMISE" | "MINIMISE" | "QUIT") => {
    switch (action) {
      case "TOGGLE_MAXIMISE":
        WindowToggleMaximise();
        setIsMaximised((m) => !m);
        break;
      case "MINIMISE":
        WindowMinimise();
        break;
      case "QUIT":
        Quit();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // handle double click
    if (e.detail === 2) {
      handleAction("TOGGLE_MAXIMISE");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="pointer-events-auto fixed left-0 top-0 z-[999999] flex h-10 w-full select-none items-center justify-between border-b bg-background"
      style={{ "--wails-draggable": "drag" } as React.CSSProperties}
    >
      <div className="flex items-center gap-x-2 px-2">
        <img src={appIcon} className="size-4" />
        <span className="text-sm">AeroMod</span>
      </div>
      <div
        className="flex items-center"
        style={{ "--wails-draggable": "no-drag" } as React.CSSProperties}
      >
        <div
          className="flex h-10 w-12 items-center justify-center transition hover:bg-accent"
          onClick={() => handleAction("MINIMISE")}
        >
          <MinusIcon className="size-4 stroke-muted-foreground" />
        </div>
        <div
          className="flex h-10 w-12 items-center justify-center transition hover:bg-accent"
          onClick={() => handleAction("TOGGLE_MAXIMISE")}
        >
          {isMaximised ? (
            <>
              <img
                src={maximizeIconLight}
                className="block size-3 dark:hidden"
              />
              <img
                src={maximizeIconDark}
                className="hidden size-3 dark:block"
              />
            </>
          ) : (
            <SquareIcon className="size-3 stroke-muted-foreground" />
          )}
        </div>
        <div
          className="flex h-10 w-12 items-center justify-center transition hover:bg-red-500"
          onClick={() => handleAction("QUIT")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 50 50"
            className="fill-muted-foreground stroke-muted-foreground"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
