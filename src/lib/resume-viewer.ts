export const MAX_ZOOM_LEVEL = 1.0;
export const MIN_ZOOM_LEVEL = 0.25;
export const ZOOM_STEP = 0.1;

export function clampScale(scale: number) {
  return Math.max(Math.min(MAX_ZOOM_LEVEL, scale), MIN_ZOOM_LEVEL);
}

export function getScreenMatchedScale(
  screenWidth: number,
  contentWidth: number,
) {
  return clampScale(screenWidth / contentWidth);
}

export function getNextScale(currentScale: number, delta: number) {
  return clampScale(currentScale + delta);
}

export function getWheelScaleDelta(deltaY: number) {
  return deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
}

export function shouldTrackZoomModifierKey(key: string) {
  return key === "Control" || key === "Meta";
}

type ResumeViewerElements = {
  viewerRoot: HTMLElement;
  zoomContainer: HTMLDivElement;
  fullscreenButton: HTMLButtonElement;
  zoomInButton: HTMLButtonElement;
  zoomOutButton: HTMLButtonElement;
};

function getRequiredElements(documentObject: Document): ResumeViewerElements {
  const viewerRoot = documentObject.querySelector("#viewer-root");
  const zoomContainer = documentObject.querySelector("#zoom-container");
  const fullscreenButton = documentObject.querySelector("#fullscreen-btn");
  const zoomInButton = documentObject.querySelector("#zoom-in-btn");
  const zoomOutButton = documentObject.querySelector("#zoom-out-btn");

  if (
    !(viewerRoot instanceof HTMLElement) ||
    !(zoomContainer instanceof HTMLDivElement) ||
    !(fullscreenButton instanceof HTMLButtonElement) ||
    !(zoomInButton instanceof HTMLButtonElement) ||
    !(zoomOutButton instanceof HTMLButtonElement)
  ) {
    throw new Error("Resume viewer controls are missing from the page.");
  }

  return {
    viewerRoot,
    zoomContainer,
    fullscreenButton,
    zoomInButton,
    zoomOutButton,
  };
}

export function getViewerScale(viewerRoot: HTMLElement, windowObject: Window) {
  const rawValue = windowObject
    .getComputedStyle(viewerRoot)
    .getPropertyValue("--scaling-factor")
    .trim();

  return rawValue ? Number.parseFloat(rawValue) : 1;
}

type ResumeViewerSetupOptions = {
  document?: Document;
  window?: Window;
};

export function setupResumeViewer({
  document: documentObject = document,
  window: windowObject = window,
}: ResumeViewerSetupOptions = {}) {
  const {
    viewerRoot,
    zoomContainer,
    fullscreenButton,
    zoomInButton,
    zoomOutButton,
  } = getRequiredElements(documentObject);

  const originContentWidth = zoomContainer.offsetWidth;
  const originContentHeight = zoomContainer.offsetHeight;
  let ctrlPressed = false;

  const setScale = (scale: number) => {
    const targetValue = clampScale(scale);
    const screenMatchedScale = getScreenMatchedScale(
      documentObject.body.offsetWidth,
      originContentWidth,
    );

    zoomInButton.disabled = targetValue === MAX_ZOOM_LEVEL;
    zoomOutButton.disabled = targetValue === MIN_ZOOM_LEVEL;
    fullscreenButton.disabled = targetValue === screenMatchedScale;

    viewerRoot.style.setProperty("--scaling-factor", targetValue.toString());
    zoomContainer.style.transform = `scale(${targetValue})`;
    zoomContainer.style.width = `${originContentWidth * targetValue}px`;
    zoomContainer.style.height = `${originContentHeight * targetValue}px`;
  };

  const matchWithScreen = () => {
    setScale(
      getScreenMatchedScale(
        documentObject.body.offsetWidth,
        originContentWidth,
      ),
    );
  };

  const handleFullscreenClick = () => {
    matchWithScreen();
  };

  const handleZoomInClick = () => {
    setScale(getNextScale(getViewerScale(viewerRoot, windowObject), ZOOM_STEP));
  };

  const handleZoomOutClick = () => {
    setScale(
      getNextScale(getViewerScale(viewerRoot, windowObject), -ZOOM_STEP),
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (shouldTrackZoomModifierKey(event.key)) {
      ctrlPressed = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (shouldTrackZoomModifierKey(event.key)) {
      ctrlPressed = false;
    }
  };

  const handleBlur = () => {
    ctrlPressed = false;
  };

  const handleWheel = (event: WheelEvent) => {
    if (!ctrlPressed) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setScale(
      getNextScale(
        getViewerScale(viewerRoot, windowObject),
        getWheelScaleDelta(event.deltaY),
      ),
    );
  };

  fullscreenButton.addEventListener("click", handleFullscreenClick);
  zoomInButton.addEventListener("click", handleZoomInClick);
  zoomOutButton.addEventListener("click", handleZoomOutClick);
  windowObject.addEventListener("keydown", handleKeyDown);
  windowObject.addEventListener("keyup", handleKeyUp);
  windowObject.addEventListener("blur", handleBlur);
  windowObject.addEventListener("wheel", handleWheel, { passive: false });

  matchWithScreen();
  viewerRoot.style.visibility = "visible";

  return () => {
    fullscreenButton.removeEventListener("click", handleFullscreenClick);
    zoomInButton.removeEventListener("click", handleZoomInClick);
    zoomOutButton.removeEventListener("click", handleZoomOutClick);
    windowObject.removeEventListener("keydown", handleKeyDown);
    windowObject.removeEventListener("keyup", handleKeyUp);
    windowObject.removeEventListener("blur", handleBlur);
    windowObject.removeEventListener("wheel", handleWheel);
  };
}
