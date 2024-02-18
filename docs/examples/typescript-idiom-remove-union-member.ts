type TPlanets = "earth" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";
type TPlanetsButEarth = Exclude<TPlanets, "earth">; // "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"

type TRemoveEarth<TName> = TName extends "earth" ? never : TName;
type TPlanetsButEarthV2 = TRemoveEarth<TPlanets>; // "mars" | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"
